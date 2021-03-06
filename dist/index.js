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
exports.main = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const pull_request_1 = require("./pull_request");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // input
            // GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
            const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN", {
                required: true
            });
            console.log(`GET Token: ${GITHUB_TOKEN}`);
            const client = github.getOctokit(GITHUB_TOKEN);
            console.log("created client");
            const pr = new pull_request_1.PullRequest(client, github.context);
            console.log("created PullRequest");
            if (pr.actionIsReviewed()) {
                yield add_label_when_reviewd(pr);
            }
            else if (pr.actionIsReviewRequested()) {
                yield rm_label_when_rereview_requested(pr);
            }
        }
        catch (error) {
            console.log(error);
            core.setFailed(error.message);
        }
    });
}
exports.main = main;
function add_label_when_reviewd(pr) {
    return __awaiter(this, void 0, void 0, function* () {
        // Approved されているか？
        if (pr.isApproved()) {
            // ユーザ名取得
            const username = pr.getUserName();
            // ユーザ名で既に Label付けされているか？
            if (!pr.hasAnyLabel([username])) {
                // ラベル付与
                yield pr.addLabels([username]);
            }
            else {
                console.log("already labeled");
            }
        }
        else {
            console.log("not Approved");
        }
    });
}
function rm_label_when_rereview_requested(pr) {
    return __awaiter(this, void 0, void 0, function* () {
        // Review依頼している ユーザ名取得
        const username = pr.getRequestedUserName();
        // ユーザ名で既に Label付けされているか？
        if (pr.hasAnyLabel([username])) {
            // ラベル削除
            yield pr.rmLabel(username);
        }
        else {
            console.log("not labeled yet");
        }
    });
}
main();
