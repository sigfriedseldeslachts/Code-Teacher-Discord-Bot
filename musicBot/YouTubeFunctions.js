const dotenv = require('dotenv').config()

const isYouTubeLink = (link) => {
    return link.toLowerCase().indexOf('youtube.com') > -1
}

const getID = (link) => {
    if (isYouTubeLink(link)) {
        return getYouTubeID()
    }
}