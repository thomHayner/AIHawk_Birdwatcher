import { openai } from "../../utils/clients/openai.js";
import { assistantName, assistantModel, assistantSystemPrompt, assistantTools } from "../../utils/clients/assistantConfig.js";

// Create a new assistant
export async function POST() {
  const assistant = await openai.beta.assistants.create({
    name: assistantName,
    model: assistantModel,
    instructions: assistantSystemPrompt,
    tools: assistantTools,
  });
  return Response.json({ assistantId: assistant.id });
};

// Update an existing assistant
// export async function PATCH(request:any) { 
//   // const files = await getAllRepoFiles(); // gwt the list of repo files
//   const file = get("file"); // retrieve the single file from FormData
//   const vectorStoreId = await getOrCreateVectorStore(); // get or create vector store

//   // upload using the file stream
//   const openaiFile = await openai.files.create({
//     file: file,
//     purpose: "assistants",
//   });

//   // add file to vector store
//   await openai.beta.vectorStores.files.create(vectorStoreId, {
//     file_id: openaiFile.id,
//   });
//   return new Response();
// }
