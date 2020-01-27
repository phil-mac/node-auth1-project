const express = require('express')
const helmet = require('helmet')

const ApiRouter = require('./api/api-router')

const server = express()

server.use(helmet())
server.use(express.json())

server.use('/api', ApiRouter)

server.use((err, req, res, next) => {
    console.log(err);
    res.json({message: "error!!!"})
})

module.exports = server;