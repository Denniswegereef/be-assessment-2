var mongo = require('mongodb')
var chalk = require('chalk')
var argon2 = require('argon2')

var db = null
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT

mongo.MongoClient.connect(url, function (err, client) {
    if (err) throw err
    return db = client.db(process.env.DB_NAME)
})

function login(req, res) {
    console.log(req.body)

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
                console.log(chalk.blue('Ingelogd op ' + user.username))
                req.session.user = {username: user.username}
                res.redirect('/dashboard')
            } else {
                console.log(chalk.red('password incorrect'))
            }
        }
    })
}

function logout(req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log('Er is een probleem met uitloggen')
        } else {
            res.redirect('/')
        }
    })
}

function register(req, callback) {
    var min = 8
    var max = 160

    var username = req.body.email
    var password = req.body.password

    var user = {
        username: username,
        name: {
            first: req.body.first,
            last: req.body.last
        },
        info: {
            gender: req.body.gender
        },
        password: null
    }

    if (!username || !password) {
        console.log('Username or password are missing')
        return
    }
    if (password.length < min || password.length > max) {
        console.log('Password must be between ' + min +
            ' and ' + max + ' characters')
        return
    }

    console.log(password)


    argon2.hash(password).then(hash => {

        user.password = hash

        var dbUsers = db.collection('users')

        dbUsers.insertOne(user, function (error, response) {
            if (error) {
                console.log('Error occurred while inserting')
                // return
            } else {
                req.session.user = {username: user.username}
                console.log(chalk.yellow('User created' + username))
                return callback(response)
            }
        })

    }).catch(err => {
        console.log(error)
    });
}

module.exports = {
    login: login,
    logout: logout,
    register: register
}

