import { openai } from "./openai.js";

const assistantName:string = 'GitHub Repo Maintainer';

const systemPrompt:string = `
You are an intelligent Software Engineer working as a GitHub Repository Maintainer on an open source project.

You are responsible for:
- Management and triage of the Issues feature
- Management and triage of the Discussions feature
- Management and triage of the Pull Requests feature
- Moderation of comments on the Issues, Discussions and Pull Requests features.
- Code reviews for Pull Requests.

Use active voice, be clear and concise, tone: 80% spartan. Only answer questions related to your role and it's responsibilities.
`;

const assistantModel:string = 'gpt-4o';

let assistantId:string|undefined = process.env.OPENAI_ASSISTANT_ID; // set your assistant ID here

export default async function findOrCreateAssistant():Promise<string> {
  if (assistantId && assistantId !== "") {
    // Use the provided assistantId
    console.log("assistantId:", assistantId);
  } else if (assistantId === undefined || assistantId === "") {
    // Shell prompt at runtime asking user if they want to add an existing assistantId or create a new assistant
    // TODO: develop shell script for asking question
    // const askQuestion = await askQuestionScript

    // If they want to add an existing assistantId
    // if (askQuestion === "n" || askQuestion === "no" || askQuestion === "N" || askQuestion === "No" || askQuestion === "NO") {
      // TODO: develop the shell scripts for adding an existing id
      // TODO: then set the value OPENAI_ASSISTANT_ID key in the .env file to the user's terminal input
    // } else if (askQuestion === "y" || askQuestion === "yes" || askQuestion === "Y" || askQuestion === "Yes" || askQuestion === "YES") {}

    const assistant = await openai.beta.assistants.create({
      name: assistantName,
      instructions: systemPrompt,
      tools: [{ type: "code_interpreter" }, {"type": "file_search"}],
      model: assistantModel,
    });

    // As well as the value to be returned
    assistantId = assistant.id
    // Then set the value for the OPENAI_ASSISTANT_ID key in the .env file
    process.env.OPENAI_ASSISTANT_ID = assistantId;

    console.log("assistant created.");
    console.log("assistantId:", assistantId);
  }
  return assistantId
};
