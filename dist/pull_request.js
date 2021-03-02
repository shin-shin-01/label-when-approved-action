"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequest = void 0;
const core = __importStar(require("@actions/core"));
class PullRequest {
    constructor(client, context) {
        this.client = client;
        this.context = context;
    }
    addLabels(labels) {
        return __awaiter(this, void 0, void 0, function* () {
            // Action実行時に取得できる情報
            // @see https://github.com/actions/toolkit/blob/825204968bef6c9829341275d8a35de5702dd965/packages/github/src/context.ts#L6
            const { owner, repo, number: pull_number } = this.context.issue;
            console.log(`owner: ${owner}`);
            console.log(`repo: ${repo}`);
            console.log(`pull_number: ${pull_number}`);
            const result = yield this.client.issues.addLabels({
                owner,
                repo,
                issue_number: pull_number,
                labels
            });
            core.debug(JSON.stringify(result));
        });
    }
    hasAnyLabel(labels) {
        if (!this.context.payload.pull_request) {
            return false;
        }
        const pullRequestLabels = this.context.payload.pull_request
            .labels;
        return pullRequestLabels.some(label => labels.includes(label));
    }
    // review 時の payload @see https://docs.github.com/en/rest/reference/pulls#reviews
    // review をしたユーザ名を取得
    getUserName() {
        const username = this.context.actor;
        return username;
    }
    // Review によって Approved されているか？
    isApproved() {
        const state = this.context.payload.review.state;
        return state == "approved";
    }
}
exports.PullRequest = PullRequest;
