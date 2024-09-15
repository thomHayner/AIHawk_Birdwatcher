import { Probot } from "probot";
import { mainTest } from "./utils/issuesAi.js";

export default (app: Probot) => {
  app.on("issues.opened", async (context) => {
    // console.log(context)
    const issueComment = context.issue({
      body: mainTest(context)
    });
    // const issueComment = context.issue({
    //   body: `Hi there @${context.payload.sender.login}, thanks for opening this issue! Please join us on Telegram to discuss this issue in greater detail! \n\n [![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/AIhawkCommunity)`,
    // });
    await context.octokit.issues.createComment(issueComment);
  });

  app.on("issue_comment.created", async (context) => {
    if (context.payload.sender.login === "ai-hawk-falconiere[bot]") {
      return
    }
    console.log(context)
    const issueComment = context.issue({
      body: "ahhhhhh" // mainTest(context)
    });
    await context.octokit.issues.createComment(issueComment);
  });
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
