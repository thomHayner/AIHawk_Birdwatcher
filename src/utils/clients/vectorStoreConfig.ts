import { openai } from "./openai.js";

let vectorStoreId:string|undefined = process.env.OPENAI_VECTOR_STORE_ID; // set your vector store ID here


export default async function getOrCreateVectorStore():Promise<string> {
  if (vectorStoreId && vectorStoreId !== "") {
    // Use the provided vectorStoreId
  } else if (vectorStoreId === undefined || vectorStoreId === "") {
    // Shell prompt at runtime asking user if they want to add an existing vectorStoreId or create a new Vector Store
    // TODO: develop shell script for asking question
    // const askQuestion = await askQuestionScript

    // If they want to add an existing vectorStoreId
    // if (askQuestion === "n" || askQuestion === "no" || askQuestion === "N" || askQuestion === "No" || askQuestion === "NO") {
      // TODO: develop the shell scripts for adding an existing id
      // TODO: then set the value OPENAI_VECTOR_STORE_ID key in the .env file to the user's terminal input
    // } else if (askQuestion === "y" || askQuestion === "yes" || askQuestion === "Y" || askQuestion === "Yes" || askQuestion === "YES") {}
  
    const vectorStore = await openai.beta.vectorStores.create({
      name: "Repository Vector Store"
    });

    // As well as the value to be returned
    vectorStoreId = vectorStore.id;
    // Then set the value for the OPENAI_VECTOR_STORE_ID key in the .env file
    // TODO: this should use node:fs (and dotenv? or no due to node v20+) to write to the .env file
    process.env.OPENAI_VECTOR_STORE_ID = vectorStoreId;

    console.log("Vector Store created.");
  }
  return vectorStoreId;
}
