import { openai } from "../utils/clients/openai.js";
import * as fs from 'node:fs';
import { assistantModel, assistantName, assistantSystemPrompt } from "../utils/clients/assistantConfig.js";
import uploadAllRepoFilesToOpenAi from "../utils/fileSearchLoader.js";

export async function assistant() {
  // Create the assistant
  const assistant = await openai.beta.assistants.create({
    name: assistantName,
    instructions: assistantSystemPrompt,
    tools: [{ type: "code_interpreter" }, {"type": "file_search"}],
    model: assistantModel
  });

  // const uploadFiles = await uploadAllRepoFilesToOpenAi();
  await uploadAllRepoFilesToOpenAi()

  // Create a filestream
  const fileStreams = ["https://raw.githubusercontent.com/thomHayner/AI_Hawk/main/src/job.py", "https://raw.githubusercontent.com/thomHayner/AI_Hawk/main/src/gpt.py"].map((path) =>
    fs.createReadStream(path),
  );

  // Create a vector store of the repository.
  let vectorStore = await openai.beta.vectorStores.create({
    name: "GitHub Repository",
  });

  // Upload files to the vector store using the filestream
  await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files: fileStreams });

  // Update file_search tool so that assistant can access the vector store
  await openai.beta.assistants.update(assistant.id, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  });

}

assistant();