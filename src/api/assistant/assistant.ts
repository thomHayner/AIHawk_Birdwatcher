import { openai } from "../../utils/openai.js";
import { assistantModel, assistantName, systemPrompt } from "../../utils/assistant-config.js";

// Create a new assistant
export async function POST() {
  const assistant = await openai.beta.assistants.create({
    instructions: systemPrompt,
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

