import { Probot } from "probot";
import initializer from "./utils/initializerProcess/initializer.js";
import issueIntake from "./AiCompletions/workflows/issueIntake.js";
import issueCommentCreated from "./AiCompletions/workflows/issueWatcher.js";
import uploadAllRepoFilesToOpenAi from "./utils/fileSearchLoader.js";

export default (app: Probot) => {
  /* 
  *  
  *  The first order of business will be to setup and configure the OpenAI Assistant and Vector Store
  *  
  */
  (async () =>  await initializer())();

  // When a new issue is opened:
  app.on("issues.opened", async (context) => {
    // All new Issues go to the 'Issue Intake' workflow:
    const issueIntakeResponse = await issueIntake(context);
    await context.octokit.issues.createComment(issueIntakeResponse);
  })

  // When an existing issue is commented on
  app.on("issue_comment.created", async (context) => {
    // If the comment was made by this bot, don't rely to self:
    // TODO: make the bot name in next line dynamic
    if (context.payload.sender.login === "ai-hawk-birdwatcher[bot]") {
      return;
    }
    // If the issue is still in 'Intake', go to the 'Issue Intake' workflow:
    else if (context.payload.issue.labels.length > 0 && context.payload.issue.labels.map((n:any)=>n.name).includes("intake")) {
      const issueIntakeResponse = await issueIntake(context);
      await context.octokit.issues.createComment(issueIntakeResponse);
    }
    // Otherwise, go to normal comment workflow:
    else {
      const issueComment = await issueCommentCreated(context);
      await context.octokit.issues.createComment(issueComment);
    };
  })

  app.on('push', async () => {
    uploadAllRepoFilesToOpenAi();
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
