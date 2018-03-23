'use strict'

var express = require('express')
var mongo = require('mongodb')

var bodyParser = require('body-parser')

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
.use(bodyParser.urlencoded({extended: true}))

.get('/', home)
.get('/login', login)

.get('/register', register)
.post('registerUser', registerUser)

.get('/dashboard', dashboard)

.get('/addUser', renderAddForm)
.post('/adduser', registerUser)

.get('/user/:id', getUser)

.listen(8080)

function home(req, res, next) {
    res.render('index.ejs')
}

function login(req, res) {
    res.render('front/log-in.ejs')
}


function dashboard(req, res) {
    db.collection('users').find().toArray(done)

    function done(err, data) {
        if (err) {
            console.log('error')
            next(err)
        } else {
            var users = {
                datas: data
            }
            // console.log(users)
            res.render('dashboard/dashboard.ejs', users)
        }
    }
}

function renderAddForm(req, res) {
    res.render('dashboard/addUser.ejs')
}

// Insert one user in the database
function addUser(req, res) {
    var dbUsers = db.collection('users')

    dbUsers.insertOne(req.body, function (error, response) {
        if (error) {
            console.log('Error occurred while inserting')
            // return
        } else {
            console.log('inserted record', response.ops[0])
            // return
        }
    })

    res.redirect('/addUser')
}

function getUser(req, res) {
    res.render('dashboard/user.ejs')
}


function register(req, res) {
    res.render('front/register.ejs')
}

function registerUser(req, res) {
    console.log(req.body)
}