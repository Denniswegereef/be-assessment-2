const mongo = require('mongodb')
const chalk = require('chalk')
const timestamp = require('time-stamp')
const argon2 = require('argon2')
const mime = require('mime-types')
const schema = require('../utils/user-schema')

let db = null
const url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT

mongo.MongoClient.connect(url, function (err, client) {
    if (err) throw err
    return db = client.db(process.env.DB_NAME)
})

function login(req, res) {

    const currentUser = req.body.email
    const password = req.body.password

    if (!currentUser || !password) {
        // Status 400
        console.log(chalk.red('Username or password are missing'))
        return
    }

    const dbUsers = db.collection('users')

    dbUsers.findOne({email: currentUser}, function (err, user) {
        if (err) {
            // error
            console.log(chalk.red('Username exists already'))
        } else {
            try {
                argon2.verify(user.password, password)
                .then(onverify)
            } catch (err) {
                res.redirect('/')
                console.log(chalk.red(err))
            }

        }

        function onverify(match) {
            if (match) {
                console.log(chalk.blue('Logged in ' + user.user))
                req.session.user = user
                res.redirect('/dashboard')
            } else {
                console.log(chalk.red('password incorrect'))
            }
        }
    })
}

function logout(req, res) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }

    req.session.destroy(function (err) {
        if (err) {
            console.log('Er is een probleem met uitloggen')
        } else {
            data.sessionUser = null
            data.message = 'Succesfully logged out'
            res.status(200).render('index.ejs', data)
        }
    })
}

function register(req, callback) {
    const input = req.body

    if (!input.password === input.passwordAgain) {
        console.log(chalk.red('Passwords do not match'))
        return
    }

    const min = 8
    const max = 160

    if (input.password.length < min || input.password.length > max) {
        console.log('Password must be between ' + min +
            ' and ' + max + ' characters')
        return
    }

    const dbUsers = db.collection('users')

    dbUsers.findOne({
        email: input.email
    }, checkUser)

    function checkUser(err, result) {
        if (err) {
        } else {
            console.log(chalk.red('User with email already exists'))
            return callback(false)
        }
    }

    argon2.hash(input.password).then(function (hash) {
        input.password = hash
        input.accountCreated = timestamp('DD/MM/YYYY-HH:mm:ss')

        schema.user(input, null, done)

        function done(user) {

            dbUsers.insertOne(user, function (error, response) {
                if (error) {
                    console.log('Error occurred while inserting')
                    // return
                } else {
                    req.session.user = user
                    console.log(chalk.yellow('User created ' + user.user))
                    return callback(response)
                }
            })
        }

    }).catch(function (err) {
        console.log(err)
    })
}

function removeUser(req, res) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }

    if (req.params.id === data.sessionUser._id) {
        const userID = new mongo.ObjectID(data.sessionUser._id)
        const collection = db.collection('users')

        collection.remove({
            _id: userID
        }, function (err, result) {
            if (err) {
                console.log(chalk.red('Something going wrong with deleting'))
            } else {
                console.log(chalk.blue('Deleted user'))
                logout(req, res)
                res.redirect('/')
            }
        })
    } else {
        data.error = {
            status: 405,
            text: 'Method not authorized'
        }
        res.status(405).render('front/error.ejs', data)
    }
}

module.exports = {
    login: login,
    logout: logout,
    register: register,
    remove: removeUser
}

