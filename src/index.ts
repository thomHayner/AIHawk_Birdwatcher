import { Probot } from "probot";
import issueOpenedIntake from "./workflows/issueIntake.js";
// import issueOpened from "./webhooks/issues.js";
import issueCommentCreated from "./webhooks/issue_comments.js";

export default (app: Probot) => {

  // When a new issue is opened:
  app.on("issues.opened", async (context) => {

    // Begin the 'Issue Intake' workflow to
    // - assign a 'Primary Label'
    // - generate an 'Official Bug Report' from a template
    const issueResponse = await issueOpenedIntake(context)
    // await context.octokit.issues.createComment(issueResponse);
  });

  /*
  * sometimes we will want to edit the original comment to apply a template
  * this will usually happen when a non-technical user opens a new issue 
  * or when someone opens a general issue
  * in those instances we will want to perform 'information gathering' by asking questions
  * then we will will either: 
  *   # edit the issue title and the original comment to apply the appropriate template with the relevant info,
  *   # and then hide all of the comments from the 'information gathering' process
  *   # OR
  *   # create a new issue with an appropriate title, template and relevant information
  *   # reference the old issue, attribute the old issue's creator and subscribe them to updates, and lastly close the old issue
  */
  // When an existing issue's originating comment is edited:
    // check if the edit came from the bot
      // if yes
        // double check to make sure that it was the bot applying the template\
        // apply any necessary labels
        // hide all other comments from 'information gathering process'
        // consider the issue properly templated and ready to proceed or otherwise be dealt with
      // if no
        // re-scan the edited comment
        // analyze and consider any new information
        // proceed as is appropriate


  // When an existing issue is commented on
  app.on("issue_comment.created", async (context) => {
    // Allow bot comments with appropriate params
    if (context.payload.sender.login === "ai-hawk-birdwatcher[bot]"
      && context.payload.issue.body
      && context.payload.issue.body.includes("PRIMARY_LABEL: ")
    ) {
      return
    }

    // Exclude other replies made by this bot
    if (context.payload.sender.login === "ai-hawk-birdwatcher[bot]") {
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
