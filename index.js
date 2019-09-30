const EventEmitter = require('events') // nodejs native import
const TelegramBot = require('node-telegram-bot-api')

// this key will be also used by other classes that implement the "Contactable"
// trait/contract
const STANDARD_EVENT_KEY = 'msg'
module.exports.STANDARD_EVENT_KEY = STANDARD_EVENT_KEY

// export a var which will be used to determine whether to use Mattermostable
// as their mode of contact
const TYPE_KEY = 'telegram'
module.exports.TYPE_KEY = TYPE_KEY

let telegramBot
// map from telegram usernames to chat ids with the bot
// (hint: the chat id seems to be the same as the user id, interestingly)
let usernameChatIdMap = {}
function setUsernameChatIdFromMessage(msg) {
    const { username, id } = msg.chat
    usernameChatIdMap[username] = id
}

let eventBus

// telegram 'updates' seem to be transient
// ... if telegram thinks you have received that update
// they will no longer return it in the getUpdates results
module.exports.init = async (token) => {
    telegramBot = new TelegramBot(token, { polling: true })

    // a singleton that will act to transmit events between the webhook listener
    // and the instances of Textable
    eventBus = new EventEmitter()

    // forward messages over the appropriate event on the eventBus
    telegramBot.on('message', msg => {
        setUsernameChatIdFromMessage(msg)
        eventBus.emit(msg.chat.username, msg.text)
    })

    try {
        const updates = await telegramBot.getUpdates()
        updates.forEach(update => {
            if (update.message) {
                setUsernameChatIdFromMessage(update.message)
            }
        })
    } catch (e) {
        console.log('failed to call getUpdates with error', e)
    }
}

class Telegramable extends EventEmitter {
    constructor(id, name) {
        super()

        if (!telegramBot) {
            throw new Error('init has not been called to setup a Telegram bot')
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
    async speak(string) {
        const chatId = usernameChatIdMap[this.id]
        if (chatId) {
            telegramBot.sendMessage(chatId, string)
        } else {
            console.log('Tried to send message to ' + this.id + ' but did not have chat_id')
        }
    }

    listen(callback) {
        // just set up the actual event listener
        // using the appropriate key,
        // but not bothering to expose it
        this.on(STANDARD_EVENT_KEY, callback)
    }

    stopListening() {
        this.removeAllListeners()
    }
}
module.exports.Telegramable = Telegramable

