import { openai } from "../../utils/clients/openai.js";
import { assistantModel, assistantName, assistantSystemPrompt } from "../../utils/clients/assistantConfig.js";

// Create a new assistant
export async function POST() {
  const assistant = await openai.beta.assistants.create({
    instructions: assistantSystemPrompt,
    name: assistantName,
    model: assistantModel,
    tools: [
      { type: "file_search" },
      { type: "code_interpreter" },
      {
        type: "function",
        function: {
          name: "add_primary_label",
          description: "Add a label to an Issue.",
          parameters: {
            type: "object",
            properties: {
              label: {
                type: "string",
                enum: ["bug", "documentation", "enhancement", "question"],
              },
            },
            required: ["label"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "add_duplicate_label",
          description: "Add a label to an Issue.",
          parameters: {
            type: "object",
            properties: {
              label: {
                type: "string",
                enum: ["duplicate", "unique"],
              },
            },
            required: ["label"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "add_secondary_label",
          description: "Add a label to an Issue.",
          parameters: {
            type: "object",
            properties: {
              label: {
                type: "string",
                enum: ["bug", "documentation", "enhancement", "question", "duplicate", "unique", "good first issue", "help wanted", "wontfix", "invalid", "intake"],
              },
            },
            required: ["label"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "remove_label",
          description: "Remove a label from an Issue.",
          parameters: {
            type: "object",
            properties: {
              label: {
                type: "string",
                enum: ["bug", "documentation", "enhancement", "question", "duplicate", "unique", "good first issue", "help wanted", "wontfix", "invalid", "intake"],
              },
            },
            required: ["label"],
          },
        },
      },
    ],
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
