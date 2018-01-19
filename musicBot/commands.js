const getYouTubeID = require('get-youtube-id')
const fetchVideoInfo = require('youtube-info')

const { addTrackToList, isMusicListEmpty, getFirstTrack, clearTrackList, removeFirstTrack } = require('./musicList.js')
const { playMusic } = require('./play.js')
const { client } = require('../base/connection')
const { isMod } = require('../base/isMod.js')

const musicBotCommands = (message) => {
    if (message) {
        const msgText = message.content

        if (msgText == "!start") {
            const channel = client.channels.find('name', 'general')
        }

        /**
         * Mods-only commando's
         */
        if (isMod(message.member)) {
            /**
             * Start de music bot
             */
            if (msgText == "!boot") {
                if (message.member.voiceChannel) {
                    message.delete()

                    if (isMusicListEmpty()) {
                        message.reply('Muziek lijst is leeg.')
                    } else {
                        playMusic(message.member.voiceChannel, getFirstTrack())
                    }
                    
                } else {
                    message.reply('je bent niet in een voice kanaal')
                }
            }

            if (msgText == '!clear') {
                clearTrackList()
                message.reply('muziek lijst proper!')
            }

            if (msgText == '!rmTrack') {
                removeFirstTrack()
            }
        }
        
        /**
         * Liedje toevoegen aan afspeellijst
        */
        if (msgText.toLowerCase().substring(0, 7) == '!muziek') {
            message.delete()
            
            let trackId = getYouTubeID(msgText.substring(8), {
                fuzzy: false
            })

            if (trackId) {
                addTrackToList(trackId, message.user)
                message.reply('liedje toegevoegd!')
            } else {
                message.reply('de link die je stuurde is ongeldig.')
            }
        }
    }
}

module.exports.musicBotCommands = musicBotCommands