// https://github.com/probot/octokit-auth-probot?tab=readme-ov-file

import { Octokit } from "@octokit/core";
import { createProbotAuth } from "octokit-auth-probot";

const ProbotOctokit = Octokit.defaults({
  authStrategy: createProbotAuth,
});

export const octokit = new ProbotOctokit({
  auth: {
    appId: process.env.APP_ID,
    privateKey: process.env.PRIVATE_KEY,
  },
});
