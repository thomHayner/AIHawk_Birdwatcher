export let vectorStoreId:string = ""; // set your vector store ID here

if (vectorStoreId === "") {
  vectorStoreId += process.env.OPENAI_VECTOR_STORE_ID;
}