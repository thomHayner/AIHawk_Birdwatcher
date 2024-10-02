import { openai } from "./openai.js";

let vectorStoreId:string|undefined = process.env.OPENAI_VECTOR_STORE_ID; // set your vector store ID here


export default async function findOrCreateVectorStore():Promise<string> {
  if (vectorStoreId && vectorStoreId !== "") {
    // Use the provided vectorStoreId
    console.log("vectorStoreId:", vectorStoreId);
  } else if (vectorStoreId === undefined || vectorStoreId === "") {
    const vectorStore = await openai.beta.vectorStores.create({
      name: "Repository Vector Store"
    });

    // As well as the value to be returned
    vectorStoreId = vectorStore.id
    // Then set the value for the OPENAI_ASSISTANT_ID key in the .env file
    process.env.OPENAI_VECTOR_STORE_ID = vectorStoreId;

    console.log("Vector Store created.");
    console.log("vectorStoreId:", vectorStoreId);
  }
  return vectorStoreId;
}
