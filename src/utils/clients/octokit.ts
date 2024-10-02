import { ProbotOctokit } from "probot";
import { createProbotAuth } from "octokit-auth-probot";

const privateKey = Buffer.from(`${process.env.PRIVATE_KEY}`, 'base64').toString('ascii');
const appId = `${process.env.APP_ID}`

export const octokit = new ProbotOctokit({

  authStrategy: createProbotAuth,
  auth: {
    appId: appId,
    privateKey: privateKey,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    installationId: process.env.INSTALLATION_ID
  }
});
