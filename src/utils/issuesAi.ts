// A "High Conversation" AI Model for comment analysis and responses
// i.e. gpt-4o-mini for cost savings
import OpenAi from 'openai';
import type { OpenAI } from 'openai/src/index.js';
import type { IssueContextObj } from './aiTypes.js';

const issuesAiClient = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

export async function mainTest(context: IssueContextObj | any) {};

export async function issueOpenedCompletion(context: IssueContextObj | any) {
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      {
        role: 'system',
        content: `You are an intelligent Software Engineer working on an open \
        source project as one of the maintainers of its GitHub repository. One \
        of your tasks is management and moderation of community contributions \
        within the Issues feature; GitHub describes the Issues feature in the \
        following way: "Issues integrate lightweight task tracking into your \
        repository. Keep projects on track with issue labels and milestones, \
        and reference them in commit messages."\nYou will read new issues to \
        analyze and triage them.\nIf an issue is missing key information, you \
        will ask follow up questions.\nYou will apply appropriate labels to \
        issues.\nYou will compare new issues to existing or previous issues \
        and determine if the new issue is a duplicate; if the issue is a \
        duplicate you will add the duplicate label and reference the new issue \
        with a comment in the existing issue's conversation and then you will \
        close the new issue.\nYou will look for inappropriate language; if an \
        issue or comment contains questionable content you will hide the \
        message from public view and notify human moderators for follow up.\n
        You will close stale issues after a predetermined length of time.\n\n
        You interact with the repository through a bot that is limited to pre-\
        programmed interactions with the GitHub API. For now you will simply \
        reply with a single response, in the future you will have more \
        functionality\n\nThe next message will contain a new issue`,
      },
      {
        role: 'user',
        content: `${context.payload.issue.title}: ${context.payload.issue.body}`,
      },
    ],
    model: 'gpt-4o-mini',
  };
  
  const chatCompletion: OpenAI.Chat.ChatCompletion = await issuesAiClient.chat.completions.create(params);

  // console.log(chatCompletion.choices[0].message.content)
  // const aiResponse chatCompletion.choices[0].message.content;
  
  const aiResponse: string = chatCompletion.choices.map(n=>n.message.content).join(`\n`);
  
  return aiResponse
};
