import * as core from "@actions/core";
import * as github from "@actions/github";
import { PullRequest } from "./pull_request";

export async function main() {
  try {
    // input
    // GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    const myToken: string = core.getInput("MYTOKEN", { required: true });
    console.log(`GET Token: ${myToken}`);

    const client: any = github.getOctokit(myToken);
    console.log("created client");

    const pr = new PullRequest(client, github.context);
    console.log("created PullRequest");

    // to debug
    const context: string = JSON.stringify(github.context, undefined, 2);
    console.log(`The event context: ${context}`);
    // await add_label_when_reviewd(pr);
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

async function add_label_when_reviewd(pr: PullRequest) {
  // Approved されているか？
  if (pr.isApproved()) {
    // ユーザ名取得
    const username: string = pr.getUserName();
    // ユーザ名で既に Label付けされているか？
    if (!pr.hasAnyLabel([username])) {
      // ラベル付与
      await pr.addLabels([username]);
    } else {
      console.log("already labeled");
    }
  } else {
    console.log("not Approved");
  }

}

main();
