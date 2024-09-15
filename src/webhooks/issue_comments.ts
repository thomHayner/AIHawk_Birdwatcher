import { mainTest } from "../utils/issuesAi.js";

export default async function issueCommentCreated(context: any): Promise<any> {
  // ChatGPT check/analyze for duplicate issues, add tags
  const aiResponseMessage = await mainTest(context);

  // Build a ProBot comment object as a respose to the incoming comment
  const issueComment = context.issue({
    body: aiResponseMessage,
  });

  return await issueComment;
};
