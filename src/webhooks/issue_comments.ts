import { mainTest } from "../utils/issuesAi.js";

export default async function issueCommentCreated(context: any): Promise<any> {
  // ChatGPT check/analyze for duplicate issues, add tags
  // const issueComment = context.issue({
  //   body: `${mainTest(context)}`,
  // });
    
  // Build a complete comment body as a respose to the incoming comment
  const issueComment = context.issue({
    body: "ahhhhhh",
  });

  return await issueComment;
};
