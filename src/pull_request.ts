import * as core from "@actions/core";
import { Context } from "@actions/github/lib/context";

export class PullRequest {
  // TODO: client type
  private client: any;
  private context: Context;

  constructor(client: any, context: Context) {
    this.client = client;
    this.context = context;
  }

  async addLabels(labels: string[]): Promise<void> {
    const { owner, repo, number: pull_number } = this.context.issue;

    const result = await this.client.issues.addLabels({
      owner,
      repo,
      pull_number,
      labels
    });

    core.debug(JSON.stringify(result));
  }

  hasAnyLabel(labels: string[]): boolean {
    if (!this.context.payload.pull_request) {
      return false;
    }
    const pullRequestLabels: string[] = this.context.payload.pull_request
      .labels;

    return pullRequestLabels.some(label => labels.includes(label));
  }
}
