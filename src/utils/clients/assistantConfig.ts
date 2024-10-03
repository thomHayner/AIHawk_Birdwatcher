import { POST as createNewAssistant } from "../../AiApi/assistant/assistant.js";

export const assistantName:string = 'GitHub Repo Maintainer';

export const assistantSystemPrompt:string = `
You are an intelligent Software Engineer working as a GitHub Repository Maintainer on an open source project.

You are responsible for:
- Management and triage of the Issues feature
- Management and triage of the Discussions feature
- Management and triage of the Pull Requests feature
- Moderation of comments on the Issues, Discussions and Pull Requests features.
- Code reviews for Pull Requests.

Use active voice, be clear and concise, tone: 80% spartan. Only answer questions related to your role and it's responsibilities.
`;

export const assistantTools:any[] = [
  { type: "file_search" },
  { type: "code_interpreter" },
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
];

export const assistantModel:string = 'gpt-4o';

let assistantId:string|undefined = process.env.OPENAI_ASSISTANT_ID; // set your assistant ID here

export default async function getOrCreateAssistant():Promise<string> {
  if (assistantId && assistantId !== "") {
    // Use the provided assistantId
  } else if (assistantId === undefined || assistantId === "") {
    // Shell prompt at runtime asking user if they want to add an existing assistantId or create a new Assistant
    // TODO: develop shell script for asking question
    // const askQuestion = await askQuestionScript

    // If they want to add an existing assistantId
    // if (askQuestion === "n" || askQuestion === "no" || askQuestion === "N" || askQuestion === "No" || askQuestion === "NO") {
      // TODO: develop the shell scripts for adding an existing id
      // TODO: then set the value OPENAI_ASSISTANT_ID key in the .env file to the user's terminal input
    // } else if (askQuestion === "y" || askQuestion === "yes" || askQuestion === "Y" || askQuestion === "Yes" || askQuestion === "YES") {}

    const response = await createNewAssistant();
    const assistant = await response.json();

    // As well as the value to be returned
    assistantId = assistant.id;
    
    // Then set the value for the OPENAI_ASSISTANT_ID key in the .env file
    // TODO: this should use node:fs (and dotenv? or no due to node v20+) to write to the .env file
    process.env.OPENAI_ASSISTANT_ID = assistantId;

    console.log("Assistant created.");
  }
  return assistantId!;
}
