const Filter = require('bad-words')

const wordFilter = new Filter({
    placeHolder: '*',
})

const acceptedWords = ['hoor', 'lust', 'damm']

acceptedWords.forEach((word) => {
    wordFilter.removeWords(word)
})

wordFilter.addWords(['kut', 'flikker', 'homo', 'gay', 'loser', 'teringlijer', 'fuck', 'shit', 'godverdomme', 'neuken', 'hoer', 'kakker', 'kanker',
                    'lul', 'hoerenzoon', 'kutkind', 'neger', 'kankerkind', 'kanker', 'zelfmoord', 'kutmens', 'tering', 'penis', 'mothefucker',
                    'fucker', 'vagina', 'nazi', 'hitler', 'terroristen', 'doemaargamen', 'ISS', 's3x', 'p0rnhub', 'pornhub', 'youporn'])

module.exports.wordFilter = wordFilter