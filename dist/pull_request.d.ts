import { Context } from "@actions/github/lib/context";
export declare class PullRequest {
    private client;
    private context;
    constructor(client: any, context: Context);
    addLabels(labels: string[]): Promise<void>;
    hasAnyLabel(labels: string[]): boolean;
}
