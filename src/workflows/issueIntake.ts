import { issueOpenedCompletion } from "../completions/issuesAi.js";
// import { issueCommentCompletion } from "../completions/issuesAi.js";

// const template = await context.octokit.rest.repos.getContent({ owner, name, path });
// fetchRepo().catch(error => {
//   error.errorMessage;
// });

// const messages = await fetchMessages();
// fetchMessages(context:any).catch(error => {
//   error.errorMessage;
// });

export default async function issueOpenedIntake(context: any): Promise<any> {

  // Greet the user and direct them to Telegram
  const greeting = `Hi there @${context.payload.sender.login}, thanks for \
  opening this issue! Please join us on Telegram to discuss it in \
  greater detail!` + `\n` + 
  `[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/AIhawkCommunity)`;
  const greetingParams = context.issue({
    body: greeting,
  });
  await context.octokit.issues.createComment(greetingParams);

  ///// ChatGPT apply label
  // const aiPrimaryLabel = await ;

  ///// ChatGPT generate official bug report
  const aiResponseMessage = await issueOpenedCompletion(context);

  ///// ChatGPT check/analyze for duplicate issues

  ///// Build a complete comment body as a respose to the new issue
  // const responseBody = greeting + `\n` + `---` + `\n` + aiResponseMessage;

  const issueComment = context.issue({
    body: aiResponseMessage,
  });

  return await issueComment;

  // POSSIBLY---
  // - ask follow up questions
  // - edit the user's initial non-templated comment to reformat it into the appropriate template
  // - respond with FAQ answers to common questions
};
