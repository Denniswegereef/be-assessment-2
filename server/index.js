'use strict'

var express = require('express')
var mongo = require('mongodb')

var bodyParser = require('body-parser')

var argon2 = require('argon2')
var session = require('express-session')

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
.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}))

.get('/', home)

.get('/login', login)
.post('/loginUser', loginUser)

.get('/register', register)
.post('/registerUser', registerUser)

.get('/dashboard', dashboard)

.get('/addUser', renderAddForm)
.post('/adduser', registerUser)

.get('/user/:id', getUser)

.listen(8080)

function home(req, res, next) {
    var  data = {
        name: 'dennis'
    }

    res.render('index.ejs', data)
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

function registerUser(req, res, next) {
    var username = req.body.username
    var password = req.body.password
    var min = 8
    var max = 160

    if (!username || !password){
        console.log('Username or password are missing')
        return
    }
    if (password.length < min || password.length > max) {
        console.log('Password must be between ' + min +
            ' and ' + max + ' characters')

        return
    }

    argon2.hash(password).then(onhash, next)

    function onhash(hash) {
        var dbUsers = db.collection('users')

        var user = {
            username: req.body.username,
            password: hash
        }

        dbUsers.insertOne(user, function (error, response) {
            if (error) {
                console.log('Error occurred while inserting')
                // return
            } else {
                res.redirect('/')
            }
        })
    }
}


function login(req, res) {
    res.render('front/log-in.ejs')
}

function loginUser(req, res, next) {
    var currentUser = req.body.username
    var password = req.body.password

    console.log(req.body.username)

    if (!currentUser || !password) {
        // Status 400
        console.log('Username or password are missing')
        return
    }

    var dbUsers = db.collection('users')

    dbUsers.findOne({username: currentUser}, function (err, user) {
        if(err) {
            // error
            console.log('error with db')
        } else {
            argon2.verify(user.password, password)
            .then(onverify)
        }
        function onverify(match) {
            if (match) {
                res.redirect('/dashboard')
            } else {
                console.log('password incorrect')
            }
        }

    })
}