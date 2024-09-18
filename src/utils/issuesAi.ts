// A 'High Conversation' AI Model for comment analysis and responses
// i.e. gpt-4o-mini for cost savings
import OpenAi from 'openai';
import type { OpenAI } from 'openai/src/index.js';
import type { IssueContextObj } from './aiObjectTyping.js';

const issuesAiClient = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt:string = `\
  You are an intelligent Software Engineer working as a GitHub Repository Maintainer on an open source project.\n
  \n
  You are responsible for:\n
    - Management and moderation of the Issues, Discussions and Pull Requests Features.\n
    - Code reviews\
`
const nextTask:string = `\
  Your next task involves the Issues feature, which GitHub describes in the following way: "Issues integrate lightweight task tracking into your repository. Keep projects on track with issue labels and milestones, and reference them in commit messages."\n
  These are your responsibilities relating to Issues:\n
    - You will analyze new issues and triage them.\n
    - If an issue is missing key information, you will ask follow up questions.\n
    - You will apply appropriate labels to issues.\n
    - You will compare new issues to existing issues (both open and closed) to determine if the new issue is a duplicate.\n
    - If an issue is a duplicate you will add the duplicate label and reference the new issue with a comment in the existing issue's conversation and then you will close the new issue.\n
    - You will look for inappropriate language; if an issue or comment contains questionable content you will hide the message from public view and notify human moderators for follow up.\n
    - You will close stale issues after a predetermined length of time.\
`

const specificTask:string = `The next message will contain a new issue, respond by telling me what follow up questions you would ask and which labels you would apply.`

export async function issueOpenedCompletion(context:IssueContextObj | any) {
  const issue = context.payload.issue;
  const params:OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: nextTask,
      },
      {
        role: 'user',
        content: specificTask,
      },
      {
        role: 'user',
        content: `${issue.labels.length > 0 ? 'Labels: ' + issue.labels.map((n:any) => n.name + ', ') + ' ' : ''}${issue.title}: ${issue.body}`,
      },
    ],
    model: 'gpt-4o-mini',
  };
  const chatCompletion:OpenAI.Chat.ChatCompletion = await issuesAiClient.chat.completions.create(params);
  const aiResponse:string = chatCompletion.choices.map(n=>n.message.content).join(`\n`);
  return aiResponse
};

export async function issueCommentCompletion(context:IssueContextObj | any, messages:any) {
  const issue = context.payload.issue;
  const params:OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: nextTask,
      },
      {
        role: 'user',
        content: specificTask,
      },
      {
        role: 'user',
        content: `${issue.labels.length > 0 ? 'Labels: ' + issue.labels.map((n:any) => n.name + ', ') + ' ' : ''}${issue.title}: ${issue.body}`,
      },
      ...messages
    ],
    model: 'gpt-4o-mini',
  };
  const chatCompletion:OpenAI.Chat.ChatCompletion = await issuesAiClient.chat.completions.create(params);
  const aiResponse:string = chatCompletion.choices.map(n=>n.message.content).join(`\n`);
  return aiResponse

  // There needs to be an abort here, somthing that checks if the conversation should be over and stops responding
  // There should also be soemthing that checks to make sure it is appropriate to respond at all, for instance, if a user specifically sends a message to someone else the bot should not respond
};
