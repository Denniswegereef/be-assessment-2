'use strict'

var express = require('express')
var mongo = require('mongodb')

var bodyParser = require('body-parser')

var argon2 = require('argon2')
var session = require('express-session')

var chalk = require('chalk')

require('dotenv').config()

var home = require('./routes/home'),
    register = require('./routes/register'),
    dashboard = require('./routes/dashboard'),
    user = require('./routes/user'),
    connect = require('./database/connect'),
    account = require('./routes/account'),
    login = require('./routes/login')


var app = express()
.set('view engine', 'ejs')
.set('views', 'src/view')
.use(express.static('static'))
.use(bodyParser.urlencoded({extended: true}))
.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}))

.get('/', home.render)

.get('/login', login.render)
.post('/loginUser', connect.login)

.get('/register', register.render)
.post('/registerUser', register.user)

.get('/dashboard', dashboard.render)

.get('/user/:id', user.render)

.get('/account', account.render)
// .post('/updateAccount', account.account)

.get('/log-out', connect.logout)

.listen(8080)

