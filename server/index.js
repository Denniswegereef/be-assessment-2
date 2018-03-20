'use strict'

var express = require('express')
var mongo = require('mongodb')

require('dotenv').config()

var db = null
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT

mongo.MongoClient.connect(url, function (err, client) {
    if (err) throw err
    db = client.db(process.env.DB_NAME)
})


module.exports = express()
.set('view engine', 'ejs')
.set('views', 'src/view')
.use(express.static('static'))
.get('/', home)
.get('/login', login)
.get('/register', register)
.get('/dashboard', dashboard)
.listen(8080)

function home(req, res, next) {
    db.collection('person').find().toArray(done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.render('index.ejs', data[0])
        }
    }
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