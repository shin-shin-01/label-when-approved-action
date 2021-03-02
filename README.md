# Label When Approved action

This action add label to PullRequest when approved, and remove label when requested review after approved. 

## Inputs

### `GITHUB_TOKEN`

## Example usage

```
- name: Label When Approved action step
  uses: shin-shin-01/label-when-approved-action@v1.0
  with:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
