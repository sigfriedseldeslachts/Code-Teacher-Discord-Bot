const axios = require('axios')
const fs = require('fs')
const moment = require('moment')
const dotenv = require('dotenv').config()
const dontenvExpanded = require('dotenv-expand')
const env = dontenvExpanded(dotenv).parsed

const { client } = require('./connection.js')
const { playMusic } = require('../musicBot/play.js')
const { isMod } = require('./isMod.js')

const commands = (message) => {
    let guildUser
    let msgText = message.content

    /**
     * Kijkt of een bericht geen vuile woorden bevat. Zo ja wordt het bericht verwijderd
     */
    if (/cancer|kanker|ebola|niger|nigger|nigga|nigah|neger|aids|nibba|kut|flikker|homo|gay|loser|teringlijer|fuck|shit|godverdomme|neuken|hoer|kakker|kanker|lul|hoerenzoon|kutkind|neger|kankerkind|kanker|zelfmoord|kutmens|tering|penis|mothefucker|fucker|vagina|nazi|hitler|terroristen|doemaargamen|isis|s3x|p0rnhub|pornhub|youporn/g.test(msgText.toLowerCase()) && message.author.id !== client.user.id) {
        message.delete()
            .then((msg) => {
                console.log(`Deleted message from ${msg.author}`)

                message.reply('let op je woorden! Bericht verwijderd')
            })
    }

    /**
     * Toont het uploadschema van Code Teacher
     */
    /*if (msgText == "!uploadschema") {
        message.channel.reply('Code Teacher uploadt dinsdag, donderdag en zaterdag. Telkens om 16u00')
    }*/

    if (msgText == '!ja') {
        axios.get('https://yesno.wtf/api?force=yes')
            .then((res) => {
                message.channel.send(['Ja', res.data.image])
            }).catch((res) => {
                message.channel.send('Ja')
            })

        message.delete()
    }

    if (msgText == '!nee') {
        axios.get('https://yesno.wtf/api?force=no')
            .then((res) => {
                message.channel.send(['Nee', res.data.image])
            }).catch((res) => {
                message.channel.send('Nee')
            })

            message.delete()
    }

    if (message.channel.id == env.chatboxChannelId) {
        /**
         * Laat een random quote zien
         */
        if (msgText == '!quote') {
            axios.post('https://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en')
                .then((response) => {
                    message.channel.send(response.data)
                }).catch((response) => {
                    message.channel.send('Oeps! Laden van een quote mislukt.')
                })
        }
            
        /**
         * Laat een random grap zien
         */
        if (msgText == '!grap') {
            axios.get('https://icanhazdadjoke.com/', {
                headers: {'Accept': 'application/json'}
            }).then((response) => {
                message.channel.send(response.data.joke)
            }).catch((response) => {
                message.channel.send('Oeps! Laden van een grap mislukt.')
            })
        }

        /**
         * Antwoordt random ja of nee
         */
        if (msgText.substring(0, 8) == '!jaofnee') {
            let messageLwrCase = msgText.substring(6).replace(/\s+/g,' ').trim().toLowerCase();

            if (msgText.indexOf('?') <= -1 || msgText == '!jaofnee') {
                message.reply(', dat lijkt geen vraag te zijn. Gebruik een ? op het einde.')
            } else {
                axios.get('https://yesno.wtf/api')
                    .then((res) => {
                        if (res.data.answer.toLowerCase() == "yes") { answer = 'Ja' } else { answer = 'Nee'}
                        message.channel.send([answer, res.data.image])
                    }).catch((res) => {
                        message.channel.send('Geen idee')
                    })
            }
        }

        if (msgText == '!kat') {
            axios.get('http://random.cat/meow')
                .then((response) => {
                    message.channel.send(response.data.file)
                }).catch((response) => {
                    message.channel.send('Kon geen cat foto sturen.')
                })
        }

        if (msgText == '!info') {
            message.channel.send([
                'Bot gemaakt door <@309733619864436736>',
                'Word Filter RegEx door <@260107579366047744>',
                'Code kan je bekijken op https://github.com/sigfriedseldeslachts/Code-Teacher-Discord-Bot'
            ])
        }
    }

    /**
     * Toont het help bericht
     */
    if (msgText == '!help') {
        message.reply([
            "gebruik de volgende commando's",
            '- !help  => toont deze informatie',
            //'- !uploadschema  => toont het uploadschema van Code Teacher',
            'De volgende items werken alleen in #chatbox',
            '- !quote  => toont een random quote',
            '- !grap  => toont een grap',
            '- !jaofnee  => antwoordt ja, nee of misschien',
            '- !kat  => stuurt een foto van een kat',
            "- !info => geeft wat van die domme informatie",
            'En er komen er nog meer! :)'
        ])
    }
}

module.exports.commands = commands
