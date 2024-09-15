import { mainTest } from "../utils/issuesAi.js";

export default async function issueOpened(context: any): Promise<any> {
  // Initial greeting, direct users to Telegram
  const greeting = `Hi there @${context.payload.sender.login}, thanks for opening this issue! Please join us on Telegram to discuss this issue in greater detail! \n\n [![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/AIhawkCommunity)`;
  
  // ChatGPT check/analyze for duplicate issues, add tags
  // const issueComment = context.issue({
  //   body: `${mainTest(context)}`
  // });

  // Build a complete comment body as a respose to the new issue
  const issueComment = context.issue({
    body: greeting,
  });

  return await issueComment;

  // POSSIBLY---
  // - ask follow up questions
  // - edit the user's initial non-templated comment to reformat it into the appropriate template
  // - respond with FAQ answers to common questions
};
