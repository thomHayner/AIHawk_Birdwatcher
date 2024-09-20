import { IssueContextObj } from "./aiObjectTyping.js";

// Fetches a list of all Comments for an Issue
export async function fetchMessages(context:any) {
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

// Fetches a File from a GitHub Repository 
export async function fetchRepo(context:any) {
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

// Applies a Label to an Issue
export async function applyPrimaryLabel(primaryLabel: string, context:IssueContextObj) {
  context.octokit.issues.addLabels(
    context.issue({
      issue_number: context.payload.issue.number,
      // begin static testin
      labels: [primaryLabel],
      ///// end static testing
    })
  );
}