 const mongo = require('mongodb')
const chalk = require('chalk')
const schema = require('../utils/user-schema')
const fs = require('fs')

let db = null
const url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT

mongo.MongoClient.connect(url, function (err, client) {
    if (err) throw err
    return db = client.db(process.env.DB_NAME)
})

function findAll(callback) {
    const collection = db.collection('users')

    collection.find().toArray(function (err, data) {
        if (err) {
            console.log(err)
        } else {
            return callback(data)
        }
    })
}

function findUser(obj, callback) {
    const collection = db.collection('users')

    collection.findOne(obj, function (err, user) {
        if (err) {
            console.log('error')
        } else {
            return callback(user)
        }
    })
}

function updateUser(input, session, callback) {

    (function clean(user) {
        for (let key in user) {
            if (user[key] === '' || user[key] === undefined) {
                delete user[key]
            }
        }
    }(input))

    schema.user(input, session, done)

    function done(updatedUser) {

        const collection = db.collection('users')

        const userID = new mongo.ObjectID(session._id)

        if (updatedUser.info.image.length > 10) {
            fs.unlink('./src/images/users/' + session.info.image, function (error) {
                if (error) {
                    console.log(error)
                }
                console.log(chalk.blue('Deleted succesfully ' + session.info.image))
            })
        }

        collection.update({_id: userID}, {
            $set: updatedUser
        })

        callback(updatedUser)
    }
}


module.exports = {
    findAll: findAll,
    find: findUser,
    update: updateUser
}
