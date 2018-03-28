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
    connect = require('./database/connect')


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

.get('/login', login)
.post('/loginUser', connect.login)

.get('/register', register.render)
.post('/registerUser', register.user)

.get('/dashboard', dashboard.render)

.get('/user/:id', user.render)

.get('/account', account)
.post('/updateAccount', updateAccount)

.get('/log-out', connect.logout)

.listen(8080)


function login(req, res) {
    res.render('front/log-in.ejs', {
        user: req.session.user
    })
}


function account(req, res) {
    if (!req.session.user) {
        res.render('dashboard/error.ejs', {
            user: req.session.user
        })
        return
    }

    var data = {
        user: req.session.user,
        info: []
    }
    var currentUser = req.session.user.username

    var dbUsers = db.collection('users')
    dbUsers.findOne({username: currentUser}, function (err, user) {
        if (err) {
            // error
            console.log('error with db')
            return
        }
        data.info = user // Binder use data to the object
        res.render('dashboard/account.ejs', data)
    })
}

function updateAccount(req, res) {
    var data = {
        user: req.session.user,
        info: []
    }
    var currentUser = req.session.user.username

    try {
        var dbUsers = db.collection('users')
        dbUsers.updateOne(
            {username: currentUser},
            {
                $set: {
                    "name.first": req.body.first,
                    "name.last": req.body.last
                }
            }
        )
    } catch (e) {
        console.log(e)
        return
    }
    res.redirect('/account')

}