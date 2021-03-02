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

  hasAnyLabel(labels: string[]): boolean {
    if (!this.context.payload.pull_request) {
      return false;
    }
    const pullRequestLabels: any[] = this.context.payload.pull_request.labels;

    return pullRequestLabels.some(label => labels.includes(label.name));
  }

  // review 時の payload @see https://docs.github.com/en/rest/reference/pulls#reviews`
  actionIsReviewed(): boolean {
    const action: string | undefined = this.context.payload.action;
    return action == "submitted";
  }

  // review をしたユーザ名を取得
  getUserName(): string {
    const username: string = this.context.actor;
    return username;
  }

  // Review によって Approved されているか？
  isApproved(): boolean {
    const state: string = this.context.payload.review.state;
    return state == "approved";
  }

  async addLabels(labels: string[]): Promise<void> {
    // Action実行時に取得できる情報
    // @see https://github.com/actions/toolkit/blob/825204968bef6c9829341275d8a35de5702dd965/packages/github/src/context.ts#L6
    const { owner, repo, number: pull_number } = this.context.issue;
    console.log(`owner: ${owner}`);
    console.log(`repo: ${repo}`);
    console.log(`pull_number: ${pull_number}`);

    const result = await this.client.issues.addLabels({
      owner,
      repo,
      issue_number: pull_number,
      labels
    });

    core.debug(JSON.stringify(result));
  }

  // request Review
  actionIsReviewRequested(): boolean {
    const action: string | undefined = this.context.payload.action;
    return action == "review_requested";
  }

  // review を request したユーザ名を取得
  getRequestedUserName(): string {
    const username: string = this.context.payload.requested_reviewer.login;
    return username;
  }

  async rmLabel(name: string): Promise<void> {
    // Action実行時に取得できる情報
    // @see https://github.com/actions/toolkit/blob/825204968bef6c9829341275d8a35de5702dd965/packages/github/src/context.ts#L6
    const { owner, repo, number: pull_number } = this.context.issue;
    console.log(`owner: ${owner}`);
    console.log(`repo: ${repo}`);
    console.log(`pull_number: ${pull_number}`);

    const result = await this.client.issues.removeLabel({
      owner,
      repo,
      issue_number: pull_number,
      name
    });

    core.debug(JSON.stringify(result));
  }
}
