const ytdl = require('ytdl-core')
const cache = require('memory-cache')
const fetchVideoInfo = require('youtube-info')

const { client } = require('../base/connection.js')
const { getFirstTrack, isMusicListEmpty, removeFirstTrack } = require('./musicList.js')

const playMusic = (voiceChannel, track) => {
    if (voiceChannel && track) {
        const channel = client.channels.find('name', 'chatbox')

        voiceChannel.join()
            .then((connection) => {
                const youtubeStream = ytdl('https://youtube.com/watch?v=' + track.url, {
                    quality: 'highest',
                    filter: 'audioonly'
                })

                dispatcher = connection.playStream(youtubeStream, {
                    bitrate: 48000,
                })

                fetchVideoInfo(track.url, (error, videoInfo) => {
                    if (!error) {
                        channel.send([
                            'Nu aan het spelen:',
                            videoInfo.title
                        ])
                    }
                })

                cache.put('musicBotPlaying', true)

                removeFirstTrack()

                dispatcher.on('end', () => {
                    if (isMusicListEmpty()) {
                        cache.put('musicBotPlaying', false)
                        console.log('Music list empty')

                        channel.send('Muziek lijst is leeg!')
                    } else {
                        playMusic(voiceChannel, getFirstTrack())
                    }
                })
            })
    }
}

module.exports.playMusic = playMusic