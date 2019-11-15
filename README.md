# rsf-telegramable

A class that can send and receive [telegram](https://telegram.org/) messages,
that has a clean and simple speak/listen API.

Works in concert with [rsf-telegram-bot](https://github.com/rapid-sensemaking-framework/rsf-telegram-bot).

## Installation
`npm install --save rsf-telegramable`

## Formatting of `id`

The `id` property of a person config should be like the following:

`username`

## Associated `type` configuration

In a person config, use type `telegram` to specify a `Telegramable`

## Telegramable Person Config Example

```json
{
  "type": "telegram",
  "id": "myusername"
}
```
