// A 'High Conversation' AI Model for comment analysis and responses
// i.e. gpt-4o-mini for cost savings
import OpenAi from 'openai';
import type { OpenAI } from 'openai/src/index.js';
import type { IssueContextObj } from './aiTypes.js';

const issuesAiClient = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt:string = `You are an intelligent Software Engineer working as a GitHub Repository Maintainer on an open source project.`

const taskAssignedByUser = `Your tasks include:\
        - management and moderation of the Issues, Discussions and Pull reviews Features\
        - code reviews, automated workflows, CI/CD and testing\
        \n\n
        the Issues feature, which GitHub describes in the following way: "Issues integrate lightweight task tracking into your repository. Keep projects on track with issue labels and milestones, and reference them in commit messages."
        - You will read issues to analyze and triage them.
        - If an issue is missing key information, you will ask follow up questions.
        - You will apply appropriate labels to issues.
        - You will compare new issues to existing or previous issues and determine if the new issue is a duplicate.
        - If an issue is a duplicate you will add the duplicate label and reference the new issue with a comment in the existing issue's conversation and then you will close the new issue.
        - You will look for inappropriate language; if an issue or comment contains questionable content you will hide the message from public view and notify human moderators for follow up.
        - You will close stale issues after a predetermined length of time.
        \n\n
        You interact with the repository through a bot that is limited to pre-programmed interactions with the GitHub API. For now you will simply reply with a single response, in the future you will have more functionality.
        \n\n
        The next message will contain a new issue`;

        `Maintainers need to wear many hats, tasks include:
        - project management,
        - troubleshooting and triaging,
        - managing community contributions,
        - dependency management,
        - git ops,
        - and ensuring the overall health of the project.`

export async function issueOpenedCompletion(context:IssueContextObj | any) {
  const params:OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `${context.payload.issue.title}: ${context.payload.issue.body}`,
      },
    ],
    model: 'gpt-4o-mini',
  };
  const chatCompletion:OpenAI.Chat.ChatCompletion = await issuesAiClient.chat.completions.create(params);
  const aiResponse:string = chatCompletion.choices.map(n=>n.message.content).join(`\n`);
  return aiResponse
};

export async function issueCommentCompletion(context:IssueContextObj | any, messages:any) {
  const params:OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `${context.payload.issue.title}: ${context.payload.issue.body}`,
      },
      ...messages
    ],
    model: 'gpt-4o-mini',
  };
  const chatCompletion:OpenAI.Chat.ChatCompletion = await issuesAiClient.chat.completions.create(params);
  const aiResponse:string = chatCompletion.choices.map(n=>n.message.content).join(`\n`);
  return aiResponse
};
