import { openai } from "../../utils/clients/openai.js";
import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
import { GET as getFileList } from "./route.js";

interface OpenAiFile {
  file_id: string;
}

interface FileListResponse {
  json():Promise<OpenAiFile[]>;
}

export async function deleteAllOpenAiFiles() {
  const response:FileListResponse = await getFileList();
  const fileList:OpenAiFile[] = await response.json();

  await Promise.all(fileList.map(async (file:OpenAiFile):Promise<void> => {
    await openai.files.del(file.file_id);
  }));
  console.log("All files have been deleted from OpenAI");
}

export async function removeAllTempFiles(){
  if (fs.existsSync("src/temp/guide_to_autostart_aihawk.pdf")){
    await fsPromises.unlink("src/temp/guide_to_autostart_aihawk.pdf");
  }
  if (fs.existsSync("src/temp/guide_to_setup_ollama_and_gemini.pdf")){
    await fsPromises.unlink("src/temp/guide_to_setup_ollama_and_gemini.pdf");
  }
  if (fs.existsSync("src/temp/guide_yaml_sections.pdf")){
    await fsPromises.unlink("src/temp/guide_yaml_sections.pdf");
  }
  if (fs.existsSync("src/temp/__init__.py")){
    await fsPromises.unlink("src/temp/__init__.py");
  }
  if (fs.existsSync("src/temp/aihawk_authenticator.py")){
    await fsPromises.unlink("src/temp/aihawk_authenticator.py");
  }
  if (fs.existsSync("src/temp/aihawk_bot_facade.py")){
    await fsPromises.unlink("src/temp/aihawk_bot_facade.py");
  }
  if (fs.existsSync("src/temp/aihawk_easy_applier.py")){
    await fsPromises.unlink("src/temp/aihawk_easy_applier.py");
  }
  if (fs.existsSync("src/temp/aihawk_job_manager.py")){
    await fsPromises.unlink("src/temp/aihawk_job_manager.py");
  }
  if (fs.existsSync("src/temp/app_config.py")){
    await fsPromises.unlink("src/temp/app_config.py");
  }
  if (fs.existsSync("src/temp/CODE_OF_CONDUCT.md")){
    await fsPromises.unlink("src/temp/CODE_OF_CONDUCT.md");
  }
  if (fs.existsSync("src/temp/CONTRIBUTING.md")){
    await fsPromises.unlink("src/temp/CONTRIBUTING.md");
  }
  if (fs.existsSync("src/temp/job_application_profile.pdf")){
    await fsPromises.unlink("src/temp/job_application_profile.pdf");
  }
  if (fs.existsSync("src/temp/job.py")){
    await fsPromises.unlink("src/temp/job.py");
  }
  if (fs.existsSync("src/temp/llm_manager.py")){
    await fsPromises.unlink("src/temp/llm_manager.py");
  }
  if (fs.existsSync("src/temp/main.py")){
    await fsPromises.unlink("src/temp/main.py");
  }
  if (fs.existsSync("src/temp/README.md")){
    await fsPromises.unlink("src/temp/README.md");
  }
  if (fs.existsSync("src/temp/requirements.txt")){
    await fsPromises.unlink("src/temp/requirements.txt");
  }
  if (fs.existsSync("src/temp/resume_liam_murphy.txt")){
    await fsPromises.unlink("src/temp/resume_liam_murphy.txt");
  }
  if (fs.existsSync("src/temp/strings.py")){
    await fsPromises.unlink("src/temp/strings.py");
  }
  if (fs.existsSync("src/temp/test_aihawk_authenticator.py")){
    await fsPromises.unlink("src/temp/test_aihawk_authenticator.py");
  }
  if (fs.existsSync("src/temp/test_aihawk_bot_facade.py")){
    await fsPromises.unlink("src/temp/test_aihawk_bot_facade.py");
  }
  if (fs.existsSync("src/temp/test_aihawk_easy_applier.py")){
    await fsPromises.unlink("src/temp/test_aihawk_easy_applier.py");
  }
  if (fs.existsSync("src/temp/test_aihawk_job_manager.py")){
    await fsPromises.unlink("src/temp/test_aihawk_job_manager.py");
  }
  if (fs.existsSync("src/temp/test_job_application_profile.py")){
    await fsPromises.unlink("src/temp/test_job_application_profile.py");
  }
  if (fs.existsSync("src/temp/test_utils.py")){
    await fsPromises.unlink("src/temp/test_utils.py");
  }
  if (fs.existsSync("src/temp/utils.py")){
    await fsPromises.unlink("src/temp/utils.py");
  }

  // if (fs.existsSync("tempFilePath")){
  //   await fsPromises.unlink("tempFilePath");
  // }
  // if (fs.existsSync("tempFilePath")){
  //   await fsPromises.unlink("tempFilePath");
  // }

  console.log("All temp files have been deleted from the local repo file system");

}
