練習で作成
@see https://docs.github.com/ja/actions/creating-actions/creating-a-javascript-action

# Hello world javascript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

uses: actions/~@v1.1
with:
  who-to-greet: 'Kaze'
