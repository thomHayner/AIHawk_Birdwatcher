import { Probot } from "probot";
import { mainTest } from "./utils/issuesAi.js";
import issueOpened from "./webhooks/issues.js";

export default (app: Probot) => {

  // When a new issue is opened
  app.on("issues.opened", async (context) => {
    // console.log(context)

    const issueComment = await issueOpened(context)
    await context.octokit.issues.createComment(issueComment);
  });

  // When an existing issue is commented on
  app.on("issue_comment.created", async (context) => {
    // console.log(context)

    // Exclude replies made by this bot
    if (context.payload.sender.login === "ai-hawk-falconiere[bot]") {
      return
    }
    console.log(context)
    const issueComment = context.issue({
      body: "ahhhhhh" // mainTest(context)
    });
    await context.octokit.issues.createComment(issueComment);
  });

  // When a new Pull Request is opened


  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
