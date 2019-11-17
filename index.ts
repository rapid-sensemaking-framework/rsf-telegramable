import * as io from 'socket.io-client'
import { EventEmitter } from 'events'
import {
  ContactableProxyConfig
} from 'rsf-types'
import { SEND_MESSAGE, RECEIVE_MESSAGE, TelegramMessage } from 'rsf-telegram-bot/protocol'

// this key will be also used by other classes that implement the "Contactable"
// trait/contract
const STANDARD_EVENT_KEY = 'msg'

// export a var which will be used to determine whether to use Mattermostable
// as their mode of contact
const TYPE_KEY = 'telegram'

let socket: SocketIOClient.Socket
let eventBus: EventEmitter

const init = async (telegramConfig: ContactableProxyConfig) => {
  // TODO: set up auth challenge with socketSecret
  const { socketUrl, socketSecret } = telegramConfig
  console.log('initializing rsf-telegramable')

  // a singleton that will act to transmit events between the webhook listener
  // and the instances of Telegramable
  eventBus = new EventEmitter()
  socket = io(socketUrl)
  socket.on(RECEIVE_MESSAGE, (telegramMessage: TelegramMessage) => {
    eventBus.emit(telegramMessage.username, telegramMessage.message)
  })
  await new Promise((resolve, reject) => {
    socket.on('connect', resolve)
  })
}

const shutdown = async () => {
  console.log('shutting down rsf-telegramable')
  socket.disconnect()
  socket.removeAllListeners()
  eventBus.removeAllListeners()
  socket = null
  eventBus = null
}

class Telegramable extends EventEmitter {
  id: string
  name: string
  constructor(id: string, name: string) {
    super()
    if (!(socket && eventBus)) {
      throw new Error('init has not been called')
    }
    // username
    this.id = id
    // a human name, optional
    this.name = name
    // forward messages from the event bus over the class/instance level event emitter
    eventBus.on(this.id, text => {
      // emit an event that conforms to the standard for Contactable
      this.emit(STANDARD_EVENT_KEY, text)
    })
  }

  // expose a function that conforms to the standard for Contactable
  // which can "reach" the person
  async speak (message: string) {
    const telegramMessage: TelegramMessage = {
      username: this.id,
      message
    }
    socket.emit(SEND_MESSAGE, telegramMessage)
  }

  listen (callback: (message: string) => void) {
    // just set up the actual event listener
    // using the appropriate key,
    // but not bothering to expose it
    this.on(STANDARD_EVENT_KEY, callback)
  }

  stopListening () {
    this.removeAllListeners()
  }
}

export {
  init,
  shutdown,
  Telegramable,
  TYPE_KEY,
  STANDARD_EVENT_KEY
}

