//  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//  █                                                                                     █
//  █  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//  █  ██████  ██████  ██████  ██████  ██████  ██████  ██████  ██████  ██████  ██████  ██████  ██████
//  █  █      █  █      █    █  █    █  █    █  █    █  █    █  █    █  █    █  █    █  █    █
//  █  █      █  █      █    █  █    █  █    █  █    █  █    █  █    █  █    █  █    █  █    █
//  █  ██████  ██████  █    █  █    █  ██████  █    █  ██████  █    █  ██████  █    █  █    █
//  █  █      █  █      █    █  █    █  █    █  █    █  █      █    █  █    █  █    █  █    █
//  █  █      █  █      █    █  █    █  █    █  █    █  █      █    █  █    █  █    █  █    █
//  █  ██████  ██████  ██████  ██████  █    █  ██████  ██████  ██████  █    █  █    █  ██████
//  █                                                                                     █
//  █                                                                                     █
//  █                                                                                     █


require('dotenv').config()
const server = require('./src/app.js')
const {
    conn,
    isHeroku
} = require('./src/db.js')

const { downloadAndSaveMovies } = require('./src/utils')

// Syncing all the models at once.
conn.sync({ force: false })
    .then(async () => {
        if (!isHeroku) downloadAndSaveMovies(100_000)
        const PORT = process.env.PORT || 3001
        server.listen(PORT, () => {
            console.log('Server listening at 3001') // eslint-disable-line no-console
        })
    })
