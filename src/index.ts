import * as core from '@actions/core';
import * as github from '@actions/github';

export function main(): void{
  try {
    const nameToGreet: string = core.getInput('who-to-greet')
    console.log(`Hello ${nameToGreet}!`);
    const time: string = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload: string = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
