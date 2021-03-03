# Label When Approved action

This action add label to PullRequest when approved, and remove label when requested review after approved. 

## Inputs

### `GITHUB_TOKEN`

## Example usage

```
name: Label to PullRequest when approved
on:
  pull_request_review:
  pull_request:
    types:
      - review_requested

jobs:
  label_job:
    runs-on: ubuntu-latest
    steps:
      - name: Label to PullRequest when approved
        uses: shin-shin-01/label-when-approved-action@1.0
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
