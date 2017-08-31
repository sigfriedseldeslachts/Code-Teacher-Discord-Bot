const Discordie = require('discordie')
const Filter = require('bad-words')
const axios = require('axios')
const schedule = require('node-schedule')
const fs = require('fs')
require('dotenv').config()

const client = new Discordie({
    autoReconnect: true,
})

const wordFilter = new Filter({
    placeHolder: '*',
})

wordFilter.removeWords('hoor')
wordFilter.addWords(['kut', 'lul', 'hoer', 'kankerkind', 'kanker kind', 'mongool']);

client.connect({
    token: process.env.DiscordToken,
})

client.Dispatcher.on('GATEWAY_READY', (event) => {
    console.log('Connected as: ' + client.User.username)

    client.User.setStatus('online', {name: 'Filmpjes aan het kijken'})

    const morningMessage = schedule.scheduleJob('00 30 7 * * *', () => {
        const mainChatChannel = client.Channels.get(process.env.mainChatChannelId)

        mainChatChannel.sendMessage('Goede morgen iedereen!')
    })
})

let randomItemObject = (obj) => {
    let keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
}

client.Dispatcher.on('MESSAGE_CREATE', (event) => {
    const message = event.message
    let guildUser

    client.Guilds.get(process.env.guildId).members.forEach((guildUserAPI) => {
        if (guildUserAPI.id == message.author.id) {
            guildUser = guildUserAPI
        }
    })
    
    /**
     * Wordt alleen uitgevoerd als het bericht niet van de bot is.
     */
    if (!message.author.bot) {
        let msgText = message.content

        /**
         * Kijkt of een bericht geen vuile woorden bevat. Zo ja wordt het bericht verwijderd
         */
        if (msgText !== wordFilter.clean(msgText)) {
            client.Messages.deleteMessage(message.id, message.channel_id)
            console.log('Message ' + message.id + ' deleted')
            message.channel.sendMessage(message.author.mention + ', let op je woorden! Je bericht is verwijderd')
        }

        /**
         * Toont het uploadschema van Code Teacher
         */
        if (msgText == "!uploadschema") {
            message.channel.sendMessage('Message info logged to console')
            message.channel.sendMessage(message.author.mention + ', Code Teacher uploadt dinsdag, donderdag en zaterdag. Telkens om 16u00')
        }

        /**
         * Deze commando's kunnen alleen uitgevoerd worden door moderators
         */
        if (typeof guildUser !== 'undefined' && guildUser.hasRole(process.env.modRoleId)) {
            if (msgText == '!doubt') {
                message.channel.uploadFile(fs.readFileSync('images/doubtImage.jpg'), null, message.author.mention + ' betwijfelt dat.')
            }
        }

        if (msgText == '!ja') {
            axios.get('https://yesno.wtf/api', {
                force: 'yes'
            }).then((res) => {
                message.channel.sendMessage(['Ja', res.data.image])
            }).catch((res) => {
                message.channel.sendMessage('Ja')
            })
        }

        if (msgText == '!nee') {
            axios.get('https://yesno.wtf/api', {
                force: 'no'
            }).then((res) => {
                message.channel.sendMessage(['Nee', res.data.image])
            }).catch((res) => {
                message.channel.sendMessage('Nee')
            })
        }

        if (message.channel_id == process.env.chatboxChannelId) {
            /**
             * Laat een random quote zien
             */
            if (msgText == '!quote') {
                axios.post('https://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en')
                    .then((response) => {
                        message.channel.sendMessage(response.data)
                    }).catch((response) => {
                        message.channel.sendMessage('Oeps! Laden van een quote mislukt.')
                    })
            }
                
            /**
             * Laat een random grap zien
             */
            if (msgText == '!grap') {
                axios.get('https://icanhazdadjoke.com/', {
                    headers: {'Accept': 'application/json'}
                }).then((response) => {
                    message.channel.sendMessage(response.data.joke)
                }).catch((response) => {
                    message.channel.sendMessage('Oeps! Laden van een grap mislukt.')
                })
            }

            /**
             * Toont een meme
             */
            if (msgText == '!meme') {
                axios.get('https://api.imgflip.com/get_memes')
                    .then((response) => {
                        console.log(response)
                        let data = randomItemObject(response.data.data.memes)
                        message.channel.sendMessage([data.name, data.url])
                    }).catch((response) => {
                        console.log(response)
                        message.channel.sendMessage('Oeps! Laden van een meme mislukt.')
                    })
            }

            /**
             * Antwoordt random ja of nee
             */
            if (msgText.substring(0, 8) == '!jaofnee') {
                let messageLwrCase = msgText.substring(6).replace(/\s+/g,' ').trim().toLowerCase();

                if (msgText.indexOf('?') <= -1 || msgText == '!jaofnee') {
                message.channel.sendMessage(message.author.mention + ', dat lijkt geen vraag te zijn. Gebruik een ? op het einde.')
                } /*else if (jquery.inArray(messageLwrCase, ['is codeteacher slecht?', 'is code teacher slecht?',
                    'sterf?', 'code teacher is slecht'])) {
                    message.channel.sendMessage('Ik kan niet antwoorden op die vraag.')
                    }*/ else {
                    switch (messageLwrCase) {
                        case 'wat is jouw naam?':
                            response = 'Cody'
                            break;
                        case 'Ben ik cool?':
                            response = "Cool alert!"
                            break;
                        case 'knock knock?':
                            response = ["Who's there?", "The door!"]
                            break;
                        case 'ben jij slecht?':
                            response = 'Ik ben beter als jouw!'
                            break;
                        case 'wie heeft jouw gemaakt?':
                            response = 'Sigfried'
                            break;
                        default:
                            axios.get('https://yesno.wtf/api')
                                .then((res) => {
                                    if (res.data.answer.toLowerCase() == "yes") { answer = 'Ja' } else { answer = 'Nee'}
                                    message.channel.sendMessage([answer, res.data.image])
                                }).catch((res) => {
                                    message.channel.sendMessage('Geen idee')
                                })
                    }

                    if (typeof response !== 'undefined') {
                        message.channel.sendMessage(response)
                    }
                }
            }

            if (msgText == '!kat') {
                axios.get('http://random.cat/meow')
                    .then((response) => {
                        message.channel.sendMessage(response.data.file)
                    }).catch((response) => {
                        message.channel.sendMessage('Kon geen cat foto sturen.')
                    })
            }

            /**
             * Stuurt een random Be Like Bill foto
             */
            if (msgText == '!bill') {
                message.channel.sendMessage('http://belikebill.azurewebsites.net/billgen-API.php?default=1&sex=m' )
            }

        }

        /**
         * Toont het help bericht
         */
        if (msgText == '!help') {
            message.channel.sendMessage([
                message.author.mention + ", gebruik de volgende commando's",
                '- !help  => toont deze informatie',
                '- !uploadschema  => toont het uploadschema van Code Teacher',
                'De volgende items werken alleen in #chatbox',
                '- !quote  => toont een random quote',
                '- !grap  => toont een grap',
                '- !jaofnee  => antwoordt ja, nee of misschien',
                '- !kat  => stuurt een foto van een kat',
                "- !bill  => stuurt een 'Be like Bill' foto",
                'En er komen er nog meer! :)'
            ])
        }
    }
})

client.Dispatcher.on('GUILD_MEMBER_ADD', (event) => {

})

process.on('SIGINT', () => {
    console.log('Interrupt signal caught.')

    client.disconnect()
    console.log('Disconnected from Discord')

    process.exit()
})