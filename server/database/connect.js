const mongo = require('mongodb')
const chalk = require('chalk')
const timestamp = require('time-stamp')
const argon2 = require('argon2')
const mime = require('mime-types')

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
            argon2.verify(user.password, password)
            .then(onverify)
        }

        function onverify(match) {
            if (match) {
                console.log(chalk.blue('Ingelogd op ' + user.user))
                req.session.user = user
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
    const input = req.body

    if (!input.password === input.passwordAgain) {
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
            work: input.work,
            additional: input.additional,
            image: input.file ? input.file.filename : null,
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

    if (input.password.length < min || input.password.length > max) {
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
                req.session.user = user
                console.log(chalk.yellow('User created ' + user.user))
                return callback(response)
            }
        })

    }).catch(function (err) {
        console.log(err)
    })
}


module.exports = {
    login: login,
    logout: logout,
    register: register
}

