const express = require('express')
const app = express()
const Discordie = require('discordie')
const Filter = require('bad-words')

app.get('/', function (request, response) {
    response.send('')
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Listening')
})

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
    
    /*
     * Wordt alleen uitgevoerd als het bericht niet van de bot is.
     */
    if (!message.author.bot) {
        let msgText = message.content

        /*
         * Kijkt of een bericht geen vuile woorden bevat. Zo ja wordt het bericht verwijderd
         */
        if (msgText !== wordFilter.clean(msgText)) {
            client.Messages.deleteMessage(message.id, message.channel_id)
            console.log('Message ' + message.id + ' deleted')
            message.channel.sendMessage(message.author.mention + ', let op je woorden! Je bericht is verwijderd')
        }

        /*
         * Toont het uploadschema van Code Teacher
         */
        if (msgText == "!uploadschema") {
            message.channel.sendMessage(message.author.mention + ', Code Teacher uploadt dinsdag, donderdag en zaterdag. Telkens om 16u00')
        }


        /*
         * Toont het help bericht
         */
        if (msgText == '!help') {
            message.channel.sendMessage([
                message.author.mention + ", gebruik de volgende commando's",
                '- !help  => toont deze informatie',
                '- !uploadschema  => toont het uploadschema van Code Teacher',
                'En er komen er nog meer! :)'
            ])
        }
    }
})

client.Dispatcher.on('GUILD_MEMBER_ADD', (event) => {

})