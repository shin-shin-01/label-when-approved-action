import { Context } from "@actions/github/lib/context";
export declare class PullRequest {
    private client;
    private context;
    constructor(client: any, context: Context);
    hasAnyLabel(labels: string[]): boolean;
    actionIsReviewed(): boolean;
    getUserName(): string;
    isApproved(): boolean;
    addLabels(labels: string[]): Promise<void>;
    actionIsReviewRequested(): boolean;
    getRequestedUserName(): string;
    rmLabel(name: string): Promise<void>;
}
