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
    conn
} = require('./src/db.js')

const isHeroku = process.env.DATABASE_URL?.includes('amazonaws')
const { downloadAndSaveMovies } = require('./src/utils')

// Syncing all the models at once.
conn.sync({ force: false })
    .then(async () => {
        const PORT = process.env.PORT || 3001
        server.listen(PORT, () => {
            console.log('Server listening at 3001') // eslint-disable-line no-console
        })
        // if (!isHeroku) downloadAndSaveMovies(50_000)
    })
