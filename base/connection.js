const Discord = require('discord.js')
const dotenv = require('dotenv').config()
const dontenvExpanded = require('dotenv-expand')
const env = dontenvExpanded(dotenv).parsed

const client = new Discord.Client()

client.login(env.DiscordToken)

module.exports.client = client