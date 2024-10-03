import getOrCreateAgent from "../clients/assistantConfig.js";
import getOrCreateVectorStore from "../clients/vectorStoreConfig.js";
import uploadAllRepoFilesToOpenAi from "../fileSearchLoader.js";
// import { deleteAllOpenAiFiles } from "./api/files/testingFilesManagement.js";
// import { removeAllTempFiles } from "./api/files/testingFilesManagement.js";
import { GET as getVectorFileList } from "../../api/assistant/file_search/vector_store.js";

export default async function initializeAssistant() {
  // deleteAllOpenAiFiles();
  // removeAllTempFiles();
  // throw new Error("Function not implemented.");

  /*
  *  1. Assistant
  *  - Check for an Assistant id...if the Assistant is not created:
  *    - Create the Assistant
  *    - Give the Assistant it's system prompt
  *    - Give the Assistant it's functions/tools ["file_search", "code_interpreter", "addLabel", "removeLabel", ...]
  */

  const assistantId = await getOrCreateAgent();
  console.log("assistantId:", assistantId);

  /*
  *  2. Vector Store
  *  - Check for a Vector Store...if the Vector Store is not created:
  *    - Create the Vector Store
  */

  const vectorStoreId = await getOrCreateVectorStore();
  console.log("vectorStoreId:", vectorStoreId);

  /*
  *    - Download the entire Git Repository from GitHub
  *    - Upload the Git Repository files to the Vector Store
  */

  await uploadAllRepoFilesToOpenAi();
  console.log("All files matching OpenAI Supported Filetypes have been Uploaded");

  const fileIds = await getVectorFileList();
  console.log("fileIds:", fileIds);

  /*
  *    - Train the Assistant on the Vector Store
  *  3. Training and Code Interpreter
  *  - Train the AI on the .github foler (README, CODE_OF_CONDUCT, CONTRIBUTING, CODEOWNERS, ISSUES_TEMPLATES,
  *    DISCUSSION_TEMPLATES), as well as the LICENSE, package.json, any [config].yml files for the repo/app,
  *    and the app.yml file for this bot.
  */



  /* 
  *  4. Update assistant with code_interpreter for key files
  */

  // const readmeFile = fileIds.find(file => file.name.toLowerCase() === 'readme.md');
  // if (readmeFile) {
  //   assistant = await openai.beta.assistants.update(assistant.id, {
  //     tools: [...assistant.tools, { type: "code_interpreter" }],
  //   });
  //   console.log("Assistant updated with code_interpreter feature");
  // }

  /* 
  *  5. Update assistant with custom functions
  */

  const customFunctions = [
    {
      type: "function",
      function: {
        name: "add_label_to_issue",
        description: "Add a label to a GitHub issue",
        parameters: {
          type: "object",
          properties: {
            issue_number: { type: "integer" },
            label: { type: "string" },
          },
          required: ["issue_number", "label"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "remove_label_from_issue",
        description: "Remove a label from a GitHub issue",
        parameters: {
          type: "object",
          properties: {
            issue_number: { type: "integer" },
            label: { type: "string" },
          },
          required: ["issue_number", "label"],
        },
      },
    },
  ];

  // await openai.beta.assistants.update(assistant.id, {
  //   tools: [...assistant.tools, ...customFunctions],
  // });

  // console.log("Assistant updated with custom functions");

  /* 
  *  6. Assistant is now ready for event-based actions
  */

  console.log("Initialization complete. Assistant is ready for event-based actions.");
  return;
}
