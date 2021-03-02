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
      case 'MYTOKEN':
        return 'token'
      default:
        return 'None'
    }
  })
})

test('succeess: label to pr', async () => {
  // @ts-ignore
  // ある程度必要な情報を定義
  github.context = {
    payload: {
      action: "submitted",
      pull_request: {
        assignee: null,
        assignees: [],
        auto_merge: null,
        base: {
          ref: "master",
        },
        closed_at: null,
        draft: false,
        labels: ["labeled"],
      },
      review: {
        state: "approved",
      },
    },
    eventName: "pull_request_review",
    actor: "Kaze-for-test",
  }
  /* 
  client = github.getOctokit(myToken) より client: undefined になる
  addLabels: client.issues.addLabels ->  エラーが発生するため
  モックとして作成し，Promise<void>を返すようにしておく
  */
 const isApprovedSpy = jest.spyOn(PullRequest.prototype, 'isApproved')
 const getUserNameSpy = jest.spyOn(PullRequest.prototype, 'getUserName')
 const hasAnyLabelSpy = jest.spyOn(PullRequest.prototype, 'hasAnyLabel')
 const addLabelsSpy = jest.spyOn(PullRequest.prototype, 'addLabels').mockReturnValue(Promise.resolve());

 await main()
 expect(isApprovedSpy).toHaveBeenCalled()
 expect(getUserNameSpy).toHaveBeenCalled()
 expect(hasAnyLabelSpy).toHaveBeenCalled()
 expect(addLabelsSpy).toHaveBeenCalled()
 // ユーザ名の確認
 expect(new PullRequest('token', github.context).getUserName()).toBe("Kaze-for-test")
})
  
test('failuer: review is not APPROVED', async () => {
  // @ts-ignore
  github.context = {
    payload: {
      action: "submitted",
      pull_request: {
        assignee: null,
        assignees: [],
        auto_merge: null,
        base: {
          ref: "master",
        },
        closed_at: null,
        draft: false,
        labels: ["labeled"],
      },
      review: {
        state: "commented", // not approved
      },
    },
    eventName: "pull_request_review",
    actor: "Kaze-for-test",
  }
  
  const isApprovedSpy = jest.spyOn(PullRequest.prototype, 'isApproved')
  const getUserNameSpy = jest.spyOn(PullRequest.prototype, 'getUserName')
  const hasAnyLabelSpy = jest.spyOn(PullRequest.prototype, 'hasAnyLabel')
  const addLabelsSpy = jest.spyOn(PullRequest.prototype, 'addLabels').mockReturnValue(Promise.resolve());

  await main()
  expect(isApprovedSpy).toHaveBeenCalled()
  expect(getUserNameSpy).not.toHaveBeenCalled()
  expect(hasAnyLabelSpy).not.toHaveBeenCalled()
  expect(addLabelsSpy).not.toHaveBeenCalled()
})

test('failuer: already labeled by reviewer', async () => {
  // @ts-ignore
  github.context = {
    payload: {
      action: "submitted",
      pull_request: {
        assignee: null,
        assignees: [],
        auto_merge: null,
        base: {
          ref: "master",
        },
        closed_at: null,
        draft: false,
        labels: ["Kaze-for-test"], // already labeled
      },
      review: {
        state: "approved",
      },
    },
    eventName: "pull_request_review",
    actor: "Kaze-for-test",
  }
  
  const isApprovedSpy = jest.spyOn(PullRequest.prototype, 'isApproved')
  const getUserNameSpy = jest.spyOn(PullRequest.prototype, 'getUserName')
  const hasAnyLabelSpy = jest.spyOn(PullRequest.prototype, 'hasAnyLabel')
  const addLabelsSpy = jest.spyOn(PullRequest.prototype, 'addLabels').mockReturnValue(Promise.resolve());

  await main()
  expect(isApprovedSpy).toHaveBeenCalled()
  expect(getUserNameSpy).toHaveBeenCalled()
  expect(hasAnyLabelSpy).toHaveBeenCalled()
  expect(addLabelsSpy).not.toHaveBeenCalled()
  // ユーザ名の確認
 expect(new PullRequest('token', github.context).getUserName()).toBe("Kaze-for-test")
})
