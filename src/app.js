const cookieParser = require('cookie-parser')
const express = require('express')
const morgan = require('morgan'); require('./config/morgan')
const passport = require('passport')
const routes = require('./routes/index.js')
const session = require('express-session')
const shrinkRay = require('shrink-ray-current');
const dummy = require('./middlewares/dummy')

const server = express()

server.name = 'Movies API'

server.use(dummy)
server.use(shrinkRay({ brotli: { mode: 0 } }))
server.use(express.urlencoded({ extended: true, limit: '50mb' }))
server.use(express.json({ limit: '50mb' }))
server.use(cookieParser())
// express session and passport stuff
server.use(session({ secret: 'dsghsfghnsfghnfgnsgs', resave: true, saveUninitialized: true }))
server.use(passport.initialize())
server.use(passport.session())
server.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, accept-encodig-extra')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  // res.header('accept-encoding-extra', 'lzma, lpaq1, zpaq, xwrt')
  next()
})
server.use(morgan(':date :status :method :url :response-time - :res[content-length]'));

server.use('/', routes)

// Error catching endware.
server.use((err, _req, res) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500
  const message = err.message || err
  console.error(err)
  res?.status(status)?.send(message)
})

module.exports = server
