// A "High Conversation" AI Model for comment analysis
import OpenAi from 'openai';
import type { OpenAI } from 'openai/src/index.js';
import type { IssueContextObj } from './aiTypes.js';

const issuesAiClient = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

export async function mainTest(context: IssueContextObj | any) {
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [{ role: 'user', content: `Say this is a test of @${context.payload.sender.login}'s comment saying ${context.payload.comment.body}...` }],
    model: 'gpt-4o-mini',
  };
  const chatCompletion: OpenAI.Chat.ChatCompletion = await issuesAiClient.chat.completions.create(params);
  return chatCompletion
};

