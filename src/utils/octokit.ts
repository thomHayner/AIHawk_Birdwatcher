import { ProbotOctokit } from "probot";

export const octokit = new ProbotOctokit({ auth: process.env.GITHUB_TOKEN });