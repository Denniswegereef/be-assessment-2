'use strict'

const express = require('express')
const mongo = require('mongodb')

const bodyParser = require('body-parser')

const argon2 = require('argon2')
const session = require('express-session')

const multer = require('multer')
const upload = multer({dest: 'src/images/users'})

const chalk = require('chalk')


require('dotenv').config()

const home = require('./routes/home'),
    register = require('./routes/register'),
    dashboard = require('./routes/dashboard'),
    user = require('./routes/user'),
    connect = require('./database/connect'),
    account = require('./routes/account'),
    login = require('./routes/login'),
    notFound = require('./routes/notfound'),
    chats = require('./routes/chats'),
    tickets = require('./routes/tickets')


const app = express()
.set('view engine', 'ejs')
.set('views', 'src/view')
.use(express.static('static'))
.use(bodyParser.urlencoded({extended: true}))
.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}))
app.use('/images', express.static('src/images'))

.get('/', home.render)

.get('/login', login.render)
.post('/loginUser', connect.login)

.get('/register', register.render)
.post('/registerUser', upload.single('cover'), register.user)

.get('/dashboard', dashboard.render)

.get('/user/:id', user.render)


.get('/tickets', tickets.render)
.get('/user/:id/sendTicket', tickets.send)
.get('/remove/:id', connect.remove)

.get('/account', account.render)
.get('/account-change', account.change)
.post('/accountChange', upload.single('cover'), account.update)

.get('/chats', chats.render)


.get('/log-out', connect.logout)

.get('*', notFound.render)

.listen(8080)

