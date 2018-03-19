'use strict'

var express = require('express')

module.exports = express()
.set('view engine', 'ejs')
.set('views', 'src/view')
.use(express.static('static'))
.get('/', home)
.get('/login', login)
.listen(8080)

function home(req, res) {
    res.render('index.ejs')
}

function login(req, res) {
    res.render('log-in/log-in.ejs')
}