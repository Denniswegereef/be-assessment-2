'use strict'

var express = require('express')

module.exports = express()
.set('view engine', 'ejs')
.set('views', 'src/view')
.use(express.static('static'))
.get('/', home)
.get('/login', login)
.get('/register', register)
.get('/dashboard', dashboard)
.listen(8080)

function home(req, res) {
    var person = {
        user: "Dennis Wegereef"
    }
    res.render('index.ejs', person)
}

function login(req, res) {
    res.render('front/log-in.ejs')
}

function register(req, res) {
    res.render('front/register.ejs')
}

function dashboard(req, res) {
    res.render('dashboard/dashboard.ejs')
}