const express = require('express')
const bcrypt = require('bcryptjs')

const API = require('./api-model')

const router = express.Router()

router.post('/register', (req, res, next) => {
    const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 10);

    credentials.password = hash;

    API.addUser(credentials)
        .then(reply => {
            res.json({uid: reply[0]})
        })
        .catch(err => {
            next(err)
        })
})

router.post('/login', (req, res, next) => {
    const credentials = req.body;
    const username = credentials.username;

    API.findBy({username})
        .then(user => {
            if (user && bcrypt.compareSync(credentials.password, user.password)){
                res.json({message: "Logged In!", uid: user.id})
            } else{
                res.status(401).json({message: 'Invalid Credentials'})
            }
        })
        .catch(err => {
            next(err)
        })
})

router.get('/users', restricted, (req, res, next) => {
    API.getUsers()
        .then(reply => {
            res.json(reply)
        })
        .catch(err => {
            next(err)
        })
})

function restricted(req, res, next){
    const {username, password} = req.headers;

    if (username && password){
        API.findBy({username})
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)){
                    next()
                } else{
                    res.status(401).json({message: 'Invalid Credentials'})
                }
            })
            .catch(err => {
                res.status(500).json({message: 'Unexpected Error'})
            })
    } else{
        res.status(400).json({message: 'No credentials provided'})
    }
}

module.exports = router;