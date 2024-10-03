import { octokit } from "./clients/octokit.js";
import { openai } from "./clients/openai.js";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import nodepath from "node:path";
import findOrCreateVectorStore from "./clients/vectorStoreConfig.js";

///// This still needs a helper to replace updated duplicate files on a push/pr (to main only)
///// This still needs a checker to not upload duplicate files

const supportedFileTypes:string[] = [".c", ".cpp", ".cs", ".css", ".doc", ".docx", ".go", ".html", ".java", ".js", ".json", ".md", ".pdf", ".php", ".pptx", ".py", ".rb", ".sh", ".tex", ".ts", ".txt"];

const vectorStoreId:string = await findOrCreateVectorStore();

export default async function uploadAllRepoFilesToOpenAi():Promise<void> {

  const files:any[] = await getRepoTreeRecursive();

  await Promise.all(files.map(async (file): Promise<any> => {
    await fileDecodeAndUpload(file);
  }))
  console.log("All files matching OpenAI Supported Filetypes have been Uploaded")
}

/* Helper functions */

// Check to see if the file is already in the Vector Store
async function checkForDuplicateFile(vectorStoreFileList:any[], fileToAdd:any):Promise<any> {
  if (vectorStoreFileList.includes(fileToAdd)) {
    return true;
  } else {
    return false;
  }
}


// Gets a list with info of all repo files
async function getRepoTreeRecursive():Promise<any[]> {
  const owner:string = process.env.OWNER ? process.env.OWNER : "";
  const repo:string = process.env.REPO ? process.env.REPO : "";

  // // get a list of all files in each directory (starting with root)
  const { data }:any = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: "cd41530f6b8ce3113c33c58de764b9fc15a4792d",
    recursive: "1",
  });

  let files:any[] = await data.tree.filter((item:any) => item.type === "blob");

  return files;
}

// Gets the fileName using file.path
async function fileNameIsolater(path:string):Promise<string> {
  const lastIndex:number = path.lastIndexOf("/");
  if (lastIndex === -1) {
    return path; // no slash found, return entire path
  };
  const fileName:string =  path.slice(lastIndex + 1);
  return fileName;
}

// Gets the fileType using file.path
async function fileTypeIsolater(path:string):Promise<string> {
  const lastIndex:number = path.lastIndexOf(".");
  if (lastIndex === -1) {
    return path; // no dot found, return entire path
  };
  const fileType:string =  path.slice(lastIndex);
  return fileType;
}

// 1. Decodes a single files's content from Base64 to readable code / txt,
// 2. Creates a local tempFile,
// 3. Uploads the tempFile to an OpenAI Cloud Vector Store instance,
// 4. Deletes the local tempFile.
async function fileDecodeAndUpload(file:any):Promise<any> {
  const owner:string = process.env.OWNER ? process.env.OWNER : "";
  const repo:string = process.env.REPO ? process.env.REPO : "";

  // skip if file is undefined
  if (!file) {
    return console.log("undefined file was skipped");
  }

  const fileName:string = await fileNameIsolater(file.path);

  // TODO: convert license to .txt - it already is a plin text file but might need .txt filetype appended
  // if (file.path === "LICENSE") {
  //   return console.log(`${file.path} was skipped because it is not supported in OpenAI Vector Stores`);
  //   file.path += ".txt"
  // }
  
  // TODO: convert gitignore to .txt - it already is a plin text file but might need .txt filetype appended
  // if (file.path === ".gitignore") {
  //   return console.log(`${file.path} was skipped because it is not supported in OpenAI Vector Stores`);
  //   file.path += ".txt"
  // }
  
  // check for un-supported filetypes
  const fileType:string = await fileTypeIsolater(file.path);
  if (!supportedFileTypes.some(type => fileType === type)) {
    return console.log(`${file.path} was skipped because ${fileType} files are not supported in OpenAI Vector Stores`);
  }

  const fileContent:any = await octokit.repos.getContent({
    owner,
    repo,
    path: file.path,
  });

  // decode the file from base64 to readable code
  const decodedContent:string = Buffer.from(fileContent.data.content, "base64").toString("utf-8");
  
  // if it's a .yml or .yaml file, convert it (future)
  // TODO: implement file converter to .txt or .json (.json preferred)

  // save the file locally (temporarily)
  // let tempFilePath:string = nodepath.join("src", "temp", fileName);
  // if it's LICENSE or .gitignore, add .txt to the tempFile path (but not file.path, otherwise OctoKit wouldn't be able to find it)
  // if (fileName === "LICENSE" || fileName === ".gitignore") {
  //   tempFilePath = nodepath.join("src", "temp", fileName+ ".txt");
  //   await fsp.writeFile(tempFilePath, decodedContent);
  // } else {
  //   tempFilePath = nodepath.join("src", "temp", fileName);
  //   await fsp.writeFile(tempFilePath, decodedContent);
  // }
  const tempFilePath:string = nodepath.join("src", "temp", fileName);
  await fsp.writeFile(tempFilePath, decodedContent);

  // upload the file to OpenAI
  const openaiFile:any = await openai.files.create({
    file: fs.createReadStream(tempFilePath),
    purpose: "assistants",
  });

  // add file to vector store
  await openai.beta.vectorStores.files.create(vectorStoreId, {
    file_id: openaiFile.id,
  });
  
  // delete the temporary file
  await fsp.unlink(tempFilePath);
  
  console.log(`Uploaded ${file.path} to OpenAI with file ID: ${openaiFile.id}`);
  return new Response();
}
