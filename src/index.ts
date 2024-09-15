import { Probot } from "probot";
import issueOpened from "./webhooks/issues.js";
import issueCommentCreated from "./webhooks/issue_comments.js";

export default (app: Probot) => {

  // When a new issue is opened:
  app.on("issues.opened", async (context) => {
    // console.log(context)

    const issueComment = await issueOpened(context)
    await context.octokit.issues.createComment(issueComment);
  });

  // When an existing issue's originating comment is edited:
  

  // When an existing issue is commented on
  app.on("issue_comment.created", async (context) => {
    // console.log(context)

    // Exclude replies made by this bot
    if (context.payload.sender.login === "ai-hawk-falconiere[bot]") {
      return
    }

    const issueComment = await issueCommentCreated(context)
    await context.octokit.issues.createComment(issueComment);
  });

  //When an existing comment (not the originating comment) is edited:


  // When a new Pull Request is opened:


  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
