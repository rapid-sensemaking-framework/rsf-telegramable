# rsf-telegramable

A class that can send and receive [telegram](https://telegram.org/) messages,
that has a clean and simple speak/listen API.

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

## API

__`init`__

`init(token)`: a function used to set the token used for the telegram bot

`token`: should look like `1kjrkjab...`

__`Telegramable`__

`constructor(id, name)`: A Telegramable is a wrapped version of a bidirectional communication channel between the program, and a person, in which messages of text/strings can be sent and received

`id`: `String`, the Telegram username to reach this person at

`name`: `String`, optional, a name of the person being contacted

### __Instance methods__
___

`speak(string)`: Contact the person represented by the Telegramable, sending them a message

`string`: `String`, the string of text to send the person represented

___

`listen(callback)`: Handle a message from the person represented by the Telegramable, received as a simple string

`callback(string)`: `Function`, give a function which will be called whenever a message from the person is received

___

`stopListening()`: Remove all event listeners
