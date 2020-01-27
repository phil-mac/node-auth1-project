const express = require('express')
const helmet = require('helmet')
const session = require('express-session')

const ApiRouter = require('./api/api-router')

const server = express()

server.use(helmet())
server.use(express.json())

server.use(
    session({
        name: 'banana4',
        secret: 'keep it secret',
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            secure: false,
        },
        httpOnly: true,
        resave: false,
        saveUninitialized: false,
    })
)

server.use('/api', ApiRouter)

server.use((err, req, res, next) => {
    console.log(err);
    res.json({message: "error!!!"})
})

module.exports = server;