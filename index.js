const Discordie = require('discordie')
const Filter = require('bad-words')
const axios = require('axios')
require('dotenv').config()

const client = new Discordie({
    autoReconnect: true,
})

const wordFilter = new Filter({
    placeHolder: '*',
})

client.connect({
    token: process.env.DiscordToken,
})

client.Dispatcher.on('GATEWAY_READY', (event) => {
    console.log('Connected as: ' + client.User.username)

    client.User.setStatus('online', {name: 'Filmpjes aan het kijken'})
})

client.Dispatcher.on('MESSAGE_CREATE', (event) => {
    const message = event.message
    
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
            message.channel.sendMessage(message.author.mention + ', Code Teacher uploadt dinsdag, donderdag en zaterdag. Telkens om 16u00')
        }

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
            axios.get('http://api.icndb.com/jokes/random')
                .then((response) => {
                    message.channel.sendMessage(response.data.value.joke)
                }).catch((response) => {
                    message.channel.sendMessage('Oeps! Laden van een grap mislukt.')
                })
        }

        if (msgText.substring(0, 6) == '!vraag') {
            const random = function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            let messageLwrCase = msgText.substring(6).replace(/\s+/g,' ').trim().toLowerCase();

            if (msgText.indexOf('?') <= -1 || msgText == '!vraag') {
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
                        switch (random(1, 3)) {
                            case 1:
                                response = 'Ja'
                                break;
                            case 2:
                                response = 'Nee'
                                break;
                            case 3:
                                response = 'Misschien'
                                break;
                            default:
                                response = 'Weet ik niet'
                        }
                }
                
                message.channel.sendMessage(response)
            }
        }

        if (msgText == '!kat') {
            axios.get('http://random.cat/meow')
                .then((response) => {
                    message.channel.sendMessage(response.data.file)
                }).catch((response) => {
                    message.channel.sendMessage('Kon geen cat foto sturen')
                })
        }

        if (msgText == '!bill') {
            message.channel.sendMessage('http://belikebill.azurewebsites.net/billgen-API.php?default=1')
        }

        /**
         * Toont het help bericht
         */
        if (msgText == '!help') {
            message.channel.sendMessage([
                message.author.mention + ", gebruik de volgende commando's",
                '- !help  => toont deze informatie',
                '- !uploadschema  => toont het uploadschema van Code Teacher',
                '- !quote  => toont een random quote',
                '- !grap  => toont een grap',
                '- !vraag  => antwoordt ja, nee of misschien',
                '- !kat  => stuurt een foto van een kat',
                "- !bill  => stuurt een 'Be like Bill' foto",
                'En er komen er nog meer! :)'
            ])
        }
    }
})

client.Dispatcher.on('GUILD_MEMBER_ADD', (event) => {

})