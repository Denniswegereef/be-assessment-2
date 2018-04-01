var mongo = require('mongodb')
var chalk = require('chalk')
var argon2 = require('argon2')
var timestamp = require('time-stamp');

var db = null
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT

mongo.MongoClient.connect(url, function (err, client) {
    if (err) throw err
    return db = client.db(process.env.DB_NAME)
})

function login(req, res) {
    console.log(req.body)

    var currentUser = req.body.email
    var password = req.body.password

    if (!currentUser || !password) {
        // Status 400
        console.log('Username or password are missing')
        return
    }

    var dbUsers = db.collection('users')

    dbUsers.findOne({email: currentUser}, function (err, user) {
        if (err) {
            // error
            console.log(chalk.red('Username bestaat al'))
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
    var input = req.body

    if (!input.password === input.passwordAgain){
        console.log(chalk.red('Passwords do not match'))
        return
    }

    const user = {
        user: input.first + ' ' + input.last,
        name: {
            first: input.first,
            last: input.last
        },
        email: input.email,
        password: input.password,
        info: {
            age: input.age,
            gender: input.gender,
            place: input.place,
            study: input.study,
            additional: input.additional,
            image: input.image ? input.image: null,
            accountCreated: timestamp('DD/MM/YYYY-HH:mm:ss')
        },
        preference: {
            sex: input.sex,
            ageMin: Number(input.ageMin),
            ageMax: Number(input.ageMax),
        },
        movies: [
            {
                name: input.movieOne
            },
            {
                name: input.movieTwo
            }
        ],
        ticket: null,
        denied: null,
        matched: null,
        blocked: null
    }

    const min = 8
    const max = 160

    if (user.password.length < min || user.password.length > max) {
        console.log('Password must be between ' + min +
            ' and ' + max + ' characters')
        return
    }

    argon2.hash(user.password).then(function (hash) {
        user.password = hash
        const dbUsers = db.collection('users')

        dbUsers.insertOne(user, function (error, response) {
            if (error) {
                console.log('Error occurred while inserting')
                // return
            } else {
                req.session.user = {username: user.email}
                console.log(chalk.yellow('User created ' + user.user))
                return callback(response)
            }
        })

    }).catch(function (err) {
        console.log(err)
    })
}

function register1(req, callback) {

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

