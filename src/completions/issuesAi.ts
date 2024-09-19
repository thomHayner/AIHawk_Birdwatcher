// A 'High Conversation' AI Model for comment analysis and responses
// i.e. gpt-4o-mini for cost savings
import OpenAi from 'openai';
import type { OpenAI } from 'openai/src/index.js';
import type { IssueContextObj } from '../utils/aiObjectTyping.js';

const issuesAiClient = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt:string = `\
  You are an intelligent Software Engineer working as a GitHub Repository Maintainer on an open source project.\n
  \n
  You are responsible for:\n
    - Management and moderation of the Issues, Discussions and Pull Requests Features.\n
    - Code reviews\
`
const taskPrompt:string = `\
  Your task involves the Issues feature, which GitHub describes in the following way: \
  "Issues integrate lightweight task tracking into your repository. \
  Keep projects on track with issue labels and milestones, and reference them in commit messages."\n
  \n
  ## Your Responsibilities Relating to Issues\n
    - Analyze new issues and triage them.\n
    - If an issue is missing key information, you will ask follow up questions.\n
    - Apply an appropriate primary label to new issues, some issues may have additional secondary labels.\n
    - Create an official Issue Report based on a template that corresponds with the primary label.\n 
    - Compare new issues to existing issues (both open and closed) to determine if the new issue is a duplicate.\n
    - If a new issue is a duplicate you will add the secondary label "duplicate" and reference the new issue with a comment in the existing issue's conversation.\n
    - Monitor issues and comments for inappropriate language; if an issue or comment contains questionable content you will hide the message from public view and notify human moderators for follow up.\n
    - Close stale issues after a predetermined length of time.\n
  \n
  ## Labels\n
  ### Primary Labels\n
  - bug\n
  - documentation\n
  - enhancement\n
  - question\n
  \n
  ### Secondary Labels\n
  - duplicate\n
  - good first issue\n
  - help wanted\n
  - invalid\n
  - wontfix\n
  \n
  ## Issue Reports\n
  - The Issue Report templates are stored in .yml files. The template will be provided after you pick a primary label\n
  - Each primary label has a corresponding template.\n
  \n
  The next message will contain a new issue. \
  If the author provided one or more labels, confirm that they are appropriate. \
  If the author provided more than one label, you should pick the most appropriate primary label. \
  If the author did not provide any labels and there is enough information in the new issue you should pick a primary label, \
  otherwise, ask follow up questions until you can determine the appropriate primary label.\n
  \n
  When you have enough information to determine the primary label, respond with "PRIMARY_LABEL: *****" (replace the ***** with your choice).\
`

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        content: taskPrompt,
      },
      {
        role: 'user',
        content: `${issue.labels.length > 0 ? 'Labels: ' + issue.labels.map((n:any) => n.name + ', ') + ' ' : ''}${issue.title}: ${issue.body}`,
      },
    ],
    model: 'gpt-4o-mini',
  };

  // If the AI has enough info to complete an issue template
  const chatCompletion:OpenAI.Chat.ChatCompletion = await issuesAiClient.chat.completions.create(params);
  const aiResponse:string = chatCompletion.choices.map(n=>n.message.content).join(`\n`);
  return aiResponse
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function issueCommentCompletion(context:IssueContextObj | any, messages:any, primaryLabel?:string, template?:any) {
  const issue = context.payload.issue;
  const params:OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: taskPrompt,
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function issueTemplateCompletion(context:IssueContextObj | any, messages:any, primaryLabel?:string, template?:any) {
  const issue = context.payload.issue;
  const params:OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: taskPrompt,
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////