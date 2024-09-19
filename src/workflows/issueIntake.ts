import { issueOpenedCompletion } from "../completions/issuesAi.js";
import { issueCommentCompletion } from "../completions/issuesAi.js";

async function fetchMessages(context:any) {
  const response = await fetch(context.payload.issue.comments_url);

  if (!response.ok) {
    const errorMessage = `An error has occured: ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const messages = await data.map( (n:any) => {
    return {
      role: n.user.login === 'ai-hawk-birdwatcher[bot]' ? 'assistant' : 'user',
      content: n.body,
    }
  });

  return messages
};

async function fetchRepo(context:any) {
  const response = await fetch(context.payload.issue.repository_url);

  if (!response.ok) {
    const errorMessage = `An error has occured: ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const repoInfo = {
    name: "LinkedIn_AIHawk_Birdwatcher", // await data.name,
    owner: "thomHayner", // await data.owner,
    path: ".github/UserNoAiYesTemplates/ISSUE_TEMPLATE/bug-issue.yml"
  }

  return repoInfo
};


// const template = await context.octokit.rest.repos.getContent({ owner, name, path });
// fetchRepo().catch(error => {
//   error.errorMessage;
// });

// const messages = await fetchMessages();
// fetchMessages(context:any).catch(error => {
//   error.errorMessage;
// });

export default async function issueOpened(context: any): Promise<any> {
  ///// Greet the user and direct them to Telegram
  const greeting = `Hi there @${context.payload.sender.login}, thanks for \
  opening this issue! Please join us on Telegram to discuss this issue in \
  greater detail!` + `\n` + 
  `[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/AIhawkCommunity)`;
  
  ///// ChatGPT check/analyze for duplicate issues, add tags
  const aiResponseMessage = await issueOpenedCompletion(context);

  ///// Build a complete comment body as a respose to the new issue
  const responseBody = greeting + `\n` + `---` + `\n` + aiResponseMessage;

  const issueComment = context.issue({
    body: responseBody,
  });

  return await issueComment;

  // POSSIBLY---
  // - ask follow up questions
  // - edit the user's initial non-templated comment to reformat it into the appropriate template
  // - respond with FAQ answers to common questions
};
