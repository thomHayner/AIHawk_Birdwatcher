import { octokit } from "./clients/octokit.js";
import { openai } from "./clients/openai.js";
import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
import nodepath from "node:path";
import findOrCreateVectorStore from "./clients/vectorStoreConfig.js";
import { GET as getVectorFileList, POST as addFileToVectorStore } from "../AiApi/assistant/file_search/vector_store.js";
import { OctokitResponse } from "@octokit/types";

// This still needs a helper to replace updated duplicate files on a push/pr (to main only)

type SupportedType = {
  ext:string;
  mime:string;
};

type RepoFile = {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
};

type VectorStoreFile = {
  file_id: string;
  filename: string;
  status: string;
};

// const supportedFileTypes:string[] = [".c", ".cpp", ".cs", ".css", ".doc", ".docx", ".go", ".html", ".java", ".js", ".json", ".md", ".pdf", ".php", ".pptx", ".py", ".rb", ".sh", ".tex", ".ts", ".txt"];
const supportedTypes:SupportedType[] = [{ext: ".c",	mime: "text/x-c"},{ext: ".cpp",	mime: "text/x-c++"},{ext: ".cs",	mime: "text/x-csharp"},{ext: ".css",	mime: "text/css"},{ext: ".doc",	mime: "application/msword"},{ext: ".docx",	mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"},{ext: ".go",	mime: "text/x-golang"},{ext: ".html",	mime: "text/html"},{ext: ".java",	mime: "text/x-java"},{ext: ".js",	mime: "text/javascript"},{ext: ".json",	mime: "application/json"},{ext: ".md",	mime: "text/markdown"},{ext: ".pdf",	mime: "application/pdf"},{ext: ".php",	mime: "text/x-php"},{ext: ".pptx",	mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"},{ext: ".py",	mime: "text/x-python"},{ext: ".py",	mime: "text/x-script.python"},{ext: ".rb",	mime: "text/x-ruby"},{ext: ".sh",	mime: "application/x-sh"},{ext: ".tex",	mime: "text/x-tex"},{ext: ".ts",	mime: "application/typescript"},{ext: ".txt",	mime: "text/plain"}];

const vectorStoreId:string = await findOrCreateVectorStore();

export default async function uploadAllRepoFilesToOpenAi():Promise<void> {
  // TODO: Check for { status: 'failed' } files.  If found, delete and retry upload.
  const repoFiles:RepoFile[] = await getRepoTreeRecursive(); // console.log("repo file list: ", repoFiles);
  const vectorStoreFileList: VectorStoreFile[] = await getVectorFileList();

  // await Promise.all(repoFiles.map(async (file):Promise<any> => {
  //   const duplicate = await checkForDuplicateFile(vectorStoreFileList, file);
  //   if (duplicate) {
  //     console.log(`${file.path} was skipped because it is already in the Vector Store`);
  //     return;
  //   } else {
  //     await fileDecodeAndUpload(file);
  //   }
  // }))
  
  for (const file of repoFiles) {
    try {
      const duplicate = await checkForDuplicateFile(vectorStoreFileList, file);
      if (duplicate) {
        console.log(`${file.path} was skipped because it is already in the Vector Store`);
      } else {
        await fileDecodeAndUpload(file);
        console.log(`Successfully processed and uploaded ${file.path}`);
      }
    } catch (error) {
      console.error(`Error processing file ${file.path}:`, error);
    }
  }
  console.log("All files matching OpenAI Supported Filetypes have been uploaded");
}

export async function updateRepoFilesToOpenAiOnPush(pullRequestFiles:RepoFile[]):Promise<void> {
  // const pullRequestFiles:RepoFile[] = await getPullRequestFiles();
  const vectorStoreFileList = await getVectorFileList();

  await Promise.all(pullRequestFiles.map(async (file:RepoFile):Promise<any> => {
    const duplicate = await checkForDuplicateFile(vectorStoreFileList, file);
    if (duplicate) {
      console.log(`${file.path} was skipped because it is already in the Vector Store`);
      return;
    } else {
      await fileDecodeAndUpload(file);
      // await addFileToVectorStore(file);
    }
    console.log("All updated files --from the most recent approved Pull Request, and matching OpenAI Supported Filetypes-- have been uploaded")
  }))
}

/* Helper functions */

// Check to see if the file is already in the Vector Store
async function checkForDuplicateFile(vectorStoreFileList:VectorStoreFile[], fileToAdd:RepoFile):Promise<boolean> {
  return new Promise((resolve) => {
    const exists = vectorStoreFileList.some((file:VectorStoreFile) => file.filename === fileToAdd.path);
    resolve(exists);
  });
}

// Gets a list with info of any repo files updated in a Pull Request
// async function getPullRequestFiles():Promise<RepoFile[]> {
//   return [];
// }

// Gets a list with info of all repo files
async function getRepoTreeRecursive():Promise<RepoFile[]> {
  const owner:string = process.env.OWNER ? process.env.OWNER : "";
  const repo:string = process.env.REPO ? process.env.REPO : "";
  const tree_sha:string=process.env.TREE_SHA ? process.env.TREE_SHA : "";

  // // get a list of all files in each directory (starting with root)
  const { data }:OctokitResponse<any> = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha,
    recursive: "1",
  });

  let files:RepoFile[] = await data.tree.filter((item:RepoFile) => item.type === "blob");

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
async function fileDecodeAndUpload(file:RepoFile):Promise<Response> {
  const owner:string = process.env.OWNER ? process.env.OWNER : "";
  const repo:string = process.env.REPO ? process.env.REPO : "";

  // skip if file is undefined
  if (!file) {
    // console.log("undefined file was skipped");
    return new Response("undefined file was skipped", { status: 400 });
  }

  // skip if file is empty
  if (file.size === 0) {
    // console.log(`${file.path} was skipped because the file size is 0`);
    return new Response(`${file.path} was skipped because the file size is 0`, { status: 400 });
  }
  
  // skip if filetype is not supported by OpenAI
  const fileType:string = await fileTypeIsolater(file.path);
  if (!supportedTypes.some(type => fileType === type.ext)) {
    // console.log(`${file.path} was skipped because ${fileType} files are not supported in OpenAI Vector Stores`);
    return new Response(`${file.path} was skipped because ${fileType} files are not supported in OpenAI Vector Stores`, { status: 400 });
  }

  const fileName:string = await fileNameIsolater(file.path);

  const fileContent:OctokitResponse<any> = await octokit.repos.getContent({
    owner,
    repo,
    path: file.path,
  });
  
  // decode the file from base64 to readable code
  const decodedContent:string = Buffer.from(fileContent.data.content, "base64").toString("utf-8");
  
  // skip if file is empty
  if (decodedContent.length === 0) {
    // console.log(`${file.path} was skipped because the file is empty`);
    return new Response(`${file.path} was skipped because the file is empty`, { status: 400 });
  }
  
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
    
    // TODO: implement file converter to .txt or .json (.json preferred)
    // if it's a .yml or .yaml file, convert it (future)

  // if it's LICENSE or .gitignore, add .txt to the tempFile path (but not file.path, otherwise OctoKit wouldn't be able to find it)
  // if (fileName === "LICENSE" || fileName === ".gitignore") {
    //   tempFilePath = nodepath.join("src", "temp", fileName+ ".txt");
    //   await fsPromises.writeFile(tempFilePath, decodedContent);
    // } else {
      //   tempFilePath = nodepath.join("src", "temp", fileName);
      //   await fsPromises.writeFile(tempFilePath, decodedContent);
      // }
      
  // save the file locally (temporarily)
  const tempFilePath:string = nodepath.join("src", "temp", fileName);
  await fsPromises.writeFile(tempFilePath, decodedContent);

  // define a helper to get the mime type
  async function getMimeType(fileType: string): Promise<string> {
    return new Promise((resolve) => {
      const mimeTypeObj = supportedTypes.find((type) => type.ext === fileType);
      if (mimeTypeObj) {
        resolve(mimeTypeObj.mime);
      } else {
        console.log(`${file.path} was skipped because its mime type is not supported`);
        return;
      }
    });
  }
  
  // get the mime type of the file
  const mimeType = await getMimeType(fileType);
  // get the size of the file
  const bytes = (await fsPromises.stat(tempFilePath)).size;
  // create the secondary filename for OpenAI
  const filename = file.path

  // create the OpenAI upload for the file
  const openaiUpload:any = await openai.uploads.create({
    bytes: bytes,
    filename: filename,
    purpose: "assistants",
    mime_type: mimeType,
  });

  const openaiUploadId = openaiUpload.id;

  // create the part for the upload
  const openaiUploadPart:any = await openai.uploads.parts.create(
    openaiUploadId,
    {
      data: fs.createReadStream(tempFilePath),
    }
  );

  const openaiUploadPartId = openaiUploadPart.id;

  // complete the upload
  const openaiUploadCompletion:any = await openai.uploads.complete(
    openaiUploadId,
    {
      part_ids: [openaiUploadPartId],
    }
  );

  const fileId = openaiUploadCompletion.file.id;

  // add file to vector store
  await openai.beta.vectorStores.files.create(vectorStoreId, {
    file_id: fileId,
  });

  // add file to vector store
  await openai.beta.vectorStores.files.create(vectorStoreId, {
    file_id: openaiUploadCompletion.file.id,
  });
  
  // delete the temporary file
  await fsPromises.unlink(tempFilePath);
  
  console.log(`Uploaded ${file.path} to OpenAI with file ID: ${openaiUploadCompletion.id}`);
  
  return new Response();
}
