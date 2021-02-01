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
  github.context = {
    payload: {
      action: 'opened',
      number: '1',
      pull_request: {
        labels: [],
        number: 1,
        title: 'test',
        user: {
          login: 'pr-creator',
        },
      },
      repository: {
        name: 'label-when-approved-action',
        owner: {
          login: 'shin-shin-01',
        },
      },
    },
    issue: {
      owner: 'label-when-approved-action',
      repo: 'shin-shin-01',
      number: 1,
    },
  }
  /* 
  client = github.getOctokit(myToken) より client: undefined になる
  addLabels: client.issues.addLabels ->  エラーが発生するため
  モックとして作成し，Promise<void>を返すようにしておく
  */
  const addLabelsSpy = jest.spyOn(PullRequest.prototype, 'addLabels').mockReturnValue(Promise.resolve());
  const hasAnyLabelSpy = jest.spyOn(PullRequest.prototype, 'hasAnyLabel')

  await main()
  expect(hasAnyLabelSpy).toHaveBeenCalled()
  expect(addLabelsSpy).toHaveBeenCalled()
})
  
test('failuer: already labeled', async () => {
  // @ts-ignore
  github.context = {
    payload: {
      action: 'opened',
      number: '1',
      pull_request: {
        labels: ["labeled"],
        number: 1,
        title: 'test',
        user: {
          login: 'pr-creator',
        },
      },
      repository: {
        name: 'label-when-approved-action',
        owner: {
          login: 'shin-shin-01',
        },
      },
    },
    issue: {
      owner: 'label-when-approved-action',
      repo: 'shin-shin-01',
      number: 1,
    },
  }
  /* 
  client = github.getOctokit(myToken) より client: undefined になる
  addLabels: client.issues.addLabels ->  エラーが発生するため
  モックとして作成し，Promise<void>を返すようにしておく
  */
  const addLabelsSpy = jest.spyOn(PullRequest.prototype, 'addLabels').mockReturnValue(Promise.resolve());
  const hasAnyLabelSpy = jest.spyOn(PullRequest.prototype, 'hasAnyLabel')

  await main()
  expect(hasAnyLabelSpy).toHaveBeenCalled()
  expect(addLabelsSpy).not.toHaveBeenCalled()
})
