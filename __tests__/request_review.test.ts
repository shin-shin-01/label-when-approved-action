import { mocked } from "ts-jest/utils";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { main } from "../src/index";
import { PullRequest } from "../src/pull_request";

jest.mock("@actions/core");
jest.mock("@actions/github");

// describe: run all-describe before test
describe('mockInput', () => {
  const coreMocked = mocked(core)
  coreMocked.getInput.mockImplementation((name: string): string => {
    switch (name) {
      case 'GITHUB_TOKEN':
        return 'token'
      default:
        return 'None'
    }
  })
})

test('[review_requested:success] PullRequestからラベルを削除する', async () => {
  // @ts-ignore
  // ある程度必要な情報を定義
  github.context = {
    payload: {
      action: "review_requested",
      pull_request: {
        assignee: null,
        assignees: [],
        auto_merge: null,
        base: {
          ref: "master",
        },
        closed_at: null,
        draft: false,
        labels: [{
          color: "#cc0000",
          name: "Kaze-for-test"
        }],
      },
      requested_reviewer: {
        login: "Kaze-for-test",
      },
    },
  }
 const actionIsReviewed = jest.spyOn(PullRequest.prototype, 'actionIsReviewed')
 const actionIsReviewRequested = jest.spyOn(PullRequest.prototype, 'actionIsReviewRequested')
 const getRequestedUserNameSpy = jest.spyOn(PullRequest.prototype, 'getRequestedUserName')
 const hasAnyLabelSpy = jest.spyOn(PullRequest.prototype, 'hasAnyLabel')
 const rmLabelSpy = jest.spyOn(PullRequest.prototype, 'rmLabel').mockReturnValue(Promise.resolve());

 await main()
 expect(actionIsReviewed).toHaveBeenCalled()
 expect(actionIsReviewRequested).toHaveBeenCalled()
 expect(getRequestedUserNameSpy).toHaveBeenCalled()
 expect(hasAnyLabelSpy).toHaveBeenCalled()
 expect(rmLabelSpy).toHaveBeenCalled()
 // ユーザ名の確認
 expect(new PullRequest('token', github.context).getRequestedUserName()).toBe("Kaze-for-test")
})

test('[review_requested:failure] not labeled yet', async () => {
  // @ts-ignore
  github.context = {
    payload: {
      action: "review_requested",
      pull_request: {
        assignee: null,
        assignees: [],
        auto_merge: null,
        base: {
          ref: "master",
        },
        closed_at: null,
        draft: false,
        labels: [], // not labeled yet
      },
      requested_reviewer: {
        login: "Kaze-for-test",
      },
    },
  }
  
  const actionIsReviewed = jest.spyOn(PullRequest.prototype, 'actionIsReviewed')
 const actionIsReviewRequested = jest.spyOn(PullRequest.prototype, 'actionIsReviewRequested')
 const getRequestedUserNameSpy = jest.spyOn(PullRequest.prototype, 'getRequestedUserName')
 const hasAnyLabelSpy = jest.spyOn(PullRequest.prototype, 'hasAnyLabel')
 const rmLabelSpy = jest.spyOn(PullRequest.prototype, 'rmLabel').mockReturnValue(Promise.resolve());

 await main()
 expect(actionIsReviewed).toHaveBeenCalled()
 expect(actionIsReviewRequested).toHaveBeenCalled()
 expect(getRequestedUserNameSpy).toHaveBeenCalled()
 expect(hasAnyLabelSpy).toHaveBeenCalled()
 expect(rmLabelSpy).not.toHaveBeenCalled()
 // ユーザ名の確認
 expect(new PullRequest('token', github.context).getRequestedUserName()).toBe("Kaze-for-test")
})
