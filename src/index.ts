import { Probot } from "probot";
import issueIntake from "./workflows/issueIntake.js";
import issueCommentCreated from "./workflows/issueWatcher.js";

export default (app: Probot) => {

  ///// When a new issue is opened:
  app.on("issues.opened", async (context) => {
    // All new Issues go to the 'Issue Intake' workflow:
    const issueIntakeResponse = await issueIntake(context)
    await context.octokit.issues.createComment(issueIntakeResponse);
  });

  /// When an existing issue is commented on
  app.on("issue_comment.created", async (context) => {
    // If the issue is still in 'Intake', go to the 'Issue Intake' workflow::
    if (context.payload.issue.labels.length > 0 && context.payload.issue.labels.map((n:any)=>n.name).includes("intake")) {
      const issueIntakeResponse = await issueIntake(context)
      await context.octokit.issues.createComment(issueIntakeResponse);
    } else {
      // Otherwise, go to normal comment workflow:
      const issueComment = await issueCommentCreated(context);
      await context.octokit.issues.createComment(issueComment);
    };
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
