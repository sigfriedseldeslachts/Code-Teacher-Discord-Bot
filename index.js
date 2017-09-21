const Discord = require('discord.js')
const axios = require('axios')
const schedule = require('node-schedule')
const fs = require('fs')
const moment = require('moment')
const dotenv = require('dotenv').config()
const dontenvExpanded = require('dotenv-expand')
const env = dontenvExpanded(dotenv).parsed

/**
 * Import other files
 */
const { client } = require('./base/connection.js')
const { playMusic } = require('./musicBot/play.js')

client.on('ready', (event) => {
    console.log('Connected as: ' + client.user.username)

    const morningMessage = schedule.scheduleJob('0 30 7 * * *', () => {
        const channel = client.channels.find('name', 'main_chat')

        channel.send('Goede morgen iedereen!')
    })

    const eveningMessage = schedule.scheduleJob('0 0 18 * * *', () => {
        const channel = client.channels.find('name', 'main_chat')

        channel.send(['De dag is bijna om. Werk je laatste bugs nog snel af.'])
    })

    playMusic()
})

client.on('message', (message) => {
    const { commands } = require('./base/commands.js')
    const { musicBotCommands } = require('./musicBot/commands.js')

    commands(message)
    musicBotCommands(message)
})

client.on('guildMemberAdd', (member) => {
    const channel = member.guild.channels.find('name', 'main_chat')

    if (channel) {
        channel.send(`Welkom ${member} op de Discord server van Code Teacher!`)
    }

    return
})

process.on('SIGINT', () => {
    client.destroy()

    console.log('Interrupt signal caught.')
    process.exit()
})