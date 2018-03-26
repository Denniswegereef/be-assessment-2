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

.get('/account', account)
.post('/updateAccount', updateAccount)

.get('/log-out', logout)


.listen(8080)

function home(req, res, next) {
    let data = {
        name: 'dennis'
    }

    res.render('index.ejs', {
        user: req.session.user
    })
}

function dashboard(req, res) {
    if (!req.session.user) {
        res.render('dashboard/error.ejs', {
            user: req.session.user
        })
        return
    }

    db.collection('users').find().toArray(done)

    function done(err, data) {
        if (err) {
            console.log('error')
            next(err)
        } else {

            // console.log(users)
            res.render('dashboard/dashboard.ejs', {
                datas: data,
                user: req.session.user
            })
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


    var userID = req.params.id
    console.log(userID)

    var data = {
        user: req.session.user,
        info: []
    }

    var dbUsers = db.collection('users')

    var o_id = new mongo.ObjectID(userID);

    dbUsers.findOne({_id: o_id}, function (err, user) {
        if (err) {
            // error
            console.log('error with db')
            return
        }
        data.info = user
        console.log('wel wat gevonden <3')
        res.render('dashboard/user.ejs', data)
    });
}

function register(req, res) {
    res.render('front/register.ejs', {
        user: req.session.user
    })
}

function registerUser(req, res, next) {
    var username = req.body.email
    var password = req.body.password
    var min = 8
    var max = 160

    if (!username || !password) {
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
            username: username,
            name: {
                first: req.body.nameFirst,
                last: req.body.nameLast
            },
            info: {
                gender: req.body.gender
            },
            password: hash
        }

        dbUsers.insertOne(user, function (error, response) {
            if (error) {
                console.log('Error occurred while inserting')
                // return
            } else {
                req.session.user = {username: username}
                res.redirect('/dashboard')
            }
        })
    }
}

function login(req, res) {
    res.render('front/log-in.ejs', {
        user: req.session.user
    })
}

function loginUser(req, res, next) {
    var currentUser = req.body.username
    var password = req.body.password

    if (!currentUser || !password) {
        // Status 400
        console.log('Username or password are missing')
        return
    }

    var dbUsers = db.collection('users')

    dbUsers.findOne({username: currentUser}, function (err, user) {
        if (err) {
            // error
            console.log('error with db')
        } else {
            argon2.verify(user.password, password)
            .then(onverify)
        }

        function onverify(match) {
            if (match) {
                console.log('Ingelogd op ' + user.username)
                req.session.user = {username: user.username}
                res.redirect('/dashboard')
            } else {
                console.log('password incorrect')
            }
        }
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
    });
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
            { username : currentUser },
            { $set: {
                "name.first": req.body.first,
                "name.last": req.body.last
            }}
        )
    } catch (e) {
        console.log(e);
        return
    }
    res.redirect('/account')

}


function logout(req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            console.log('Er is een probleem met uitloggen')
        } else {
            res.redirect('/')
        }
    })
}
