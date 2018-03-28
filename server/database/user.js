var mongo = require('mongodb')
var chalk = require('chalk')

var db = null
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT

mongo.MongoClient.connect(url, function (err, client) {
    if (err) throw err
    return db = client.db(process.env.DB_NAME)
})

function findAll(callback) {
    var collection = db.collection('users')

    collection.find().toArray(function (err, data) {
        if (err) {
            console.log(err)
        } else {
            return callback(data)
        }
    })
}

function findUser(obj, callback) {
    var collection = db.collection('users')

    collection.findOne(obj, function (err, user) {
        if (err) {
            console.log('error')
        } else {
            return callback(user)
        }
    })
}

module.exports = {
    findAll: findAll,
    find: findUser
}

