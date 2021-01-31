import * as core from "@actions/core";
import * as github from "@actions/github";
import { PullRequest } from "./pull_request";

export async function main() {
  try {
    // input
    // myToken: ${{ secrets.GITHUB_TOKEN }}
    const myToken :string = core.getInput('myToken', { required: true })
    const client :any = github.getOctokit(myToken)

    const pr = new PullRequest(client, github.context)

    if (!pr.hasAnyLabel(["labeled"])) {
      pr.addLabels(["labeled"])
    }

  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
