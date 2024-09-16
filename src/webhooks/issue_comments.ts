import { issueCommentCompletion } from "../utils/issuesAi.js";

export default async function issueCommentCreated(context: any): Promise<any> {
  // ChatGPT check/analyze for duplicate issues, add tags

  // Fetch all previous comments and turn them into a conversation with an OpenAI Assistant 
  async function fetchMessages() { 
    const response = await fetch(context.payload.issue.comments_url);
    const data = await response.json();
    const messages = await data.map( (n:any) => {
      return {
        role: n.user.login === 'ai-hawk-birdwatcher[bot]' ? 'assistant' : 'user',
        content: n.body,
      }
    });
    return messages
  }
  const messages = await fetchMessages();

  // Get an OpenAI chat completion based on the entire conversation
  const aiResponseMessage = await issueCommentCompletion(context, messages);

  // Build a ProBot comment object as a respose to the incoming comment
  const issueComment = context.issue({
    body: aiResponseMessage,
  });
  return await issueComment
};
