import { Messages } from "openai/resources/beta/threads/messages.mjs";

export type IssueContextObj = {
  issue(arg0: { issue_number: any; labels: any; }): any;
  octokit: any;
  payload: {
    sender: any;
    issue: {
      number: any;
      body: any;
      labels: any;
      sender: {
        login: any;
      };
      title: any;
    };
  };
};
