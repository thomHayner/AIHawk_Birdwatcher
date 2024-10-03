import { openai } from "../../utils/clients/openai.js";

// list files in assistant's vector store
export async function GET() {
  const fileList = await openai.files.list()

  const filesArray = await Promise.all(
    fileList.data.map(async (file) => {
      return {
        file_id: file.id
      };
    })
  );
  // return Response.json(filesArray);
  return filesArray;
}

// delete file from assistant's vector store
export async function DELETE(request: { json: () => any; }) {
  const body = await request.json();
  const fileId = body.fileId;

  await openai.files.del(fileId); // delete file from OpenAI

  return new Response();
}