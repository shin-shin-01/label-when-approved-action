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

    if (!pr.hasAnyLabel(["labeled"])) {
      await pr.addLabels(["labeled"]);
    } else {
      console.log("already labeledToken");
    }
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

main();
