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


## Usage

You must be running an instance of [rsf-telegram-bot](https://github.com/rapid-sensemaking-framework/rsf-telegram-bot) to connect to via websockets in order for the following to work. Say that is running on localhost, on port 3022...

```javascript
const { init, shutdown, Telegramable } = require('rsf-telegramable')

const config = {
  socketUrl: 'ws://localhost:3022'
}
init(config).then(() => {
  const person = new Telegramable('tgusername')
  // log anything that we hear from them
  person.listen(console.log)
  person.speak('hello!')

  // after 5 seconds, shutdown/disconnect
  // person methods will no longer work, or be fired
  setTimeout(() => {
    shutdown()
  }, 5000)
})

```
