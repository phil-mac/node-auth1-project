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
                req.session.userId = user.id
                console.log(user.id)
                console.log(req.session.userId)
                res.json({message: "Logged In!", uid: user.id})
            } else{
                res.status(401).json({message: 'Invalid Credentials'})
            }
        })
        .catch(err => {
            next(err)
        })
})

router.get('/logout', (req, res) => {
    if (req.session){
        req.session.destroy(err => {
            if (err){
                res.send('error loggin out')
            } else{
                res.send('byeeee');
            }
        })
    }
})

router.get('/users', protected, (req, res, next) => {
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

function protected(req, res, next){
    console.log(req.session)
    if (req.session && req.session.userId){
        next()
    } else {
        res.status(401).json({message: 'you shall not pass!!'})
    }
}



module.exports = router;