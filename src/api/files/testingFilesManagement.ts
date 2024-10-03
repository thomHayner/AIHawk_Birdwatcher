import { openai } from "../../utils/clients/openai.js";
import * as fsPromises from "node:fs/promises";
import { GET as getFileList } from "./files.js";

export async function deleteAllFromTesting() {
  let fileList = await getFileList();

  await Promise.all(fileList.map(async (file):Promise<any> => {
    await openai.files.del(file.file_id);
  }))
  console.log("All files have been deleted from OpenAI");
}

export async function removeTempFiles(){
  // await fsPromises.unlink("src/temp/guide_to_autostart_aihawk.pdf");
  // await fsPromises.unlink("src/temp/guide_to_setup_ollama_and_gemini.pdf");
  // await fsPromises.unlink("src/temp/guide_yaml_sections.pdf");

  // await fsPromises.unlink("src/temp/__init__.py");
  
  // await fsPromises.unlink("src/temp/aihawk_authenticator.py");
  // await fsPromises.unlink("src/temp/aihawk_bot_facade.py");
  // await fsPromises.unlink("src/temp/aihawk_easy_applier.py");
  // await fsPromises.unlink("src/temp/aihawk_job_manager.py");
  // await fsPromises.unlink("src/temp/app_config.py");
  // await fsPromises.unlink("src/temp/CODE_OF_CONDUCT.md");
  // await fsPromises.unlink("src/temp/CONTRIBUTING.md");
  // await fsPromises.unlink("src/temp/job_application_profile.py");
  // await fsPromises.unlink("src/temp/job.py");
  // await fsPromises.unlink("src/temp/llm_manager.py");
  // await fsPromises.unlink("src/temp/main.py");
  // await fsPromises.unlink("src/temp/README.md");
  // await fsPromises.unlink("src/temp/requirements.txt");
  // await fsPromises.unlink("src/temp/resume_liam_murphy.txt");
  // await fsPromises.unlink("src/temp/strings.py");
  // await fsPromises.unlink("src/temp/test_aihawk_authenticator.py");
  // await fsPromises.unlink("src/temp/test_aihawk_bot_facade.py");
  // await fsPromises.unlink("src/temp/test_aihawk_easy_applier.py");
  // await fsPromises.unlink("src/temp/test_aihawk_job_manager.py");
  // await fsPromises.unlink("src/temp/test_job_application_profile.py");
  // await fsPromises.unlink("src/temp/test_utils.py");
  // await fsPromises.unlink("src/temp/utils.py");

  // await fsPromises.unlink("tempFilePath");
  // await fsPromises.unlink("tempFilePath");
}
