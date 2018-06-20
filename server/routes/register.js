const argon2 = require('argon2'),
    database = require('../database/connect'),
    chalk = require('chalk'),
    mongo = require('mongodb')

let db = null
const url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT

mongo.MongoClient.connect(url, function (err, client) {
    if (err) throw err
    return db = client.db(process.env.DB_NAME)
})

function render(req, res) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }

    res.render('front/register.ejs', data)
}

// Register the user
function user(req, res) {
    req.body.file = req.file

    database.register(req, done)

    function done(user) {
        try {
            if(!user) {
                res.redirect('/')
            } else {
                res.redirect('/dashboard')
            }
        } catch (err) {
            console.log(err)
        }
    }
}

function availableUser(req, res) {
  const collection = db.collection('users')

  collection.findOne({
    "email": req.params.email
  }, function (err, user) {
      if (err) {
        console.log(error)
      } else {
        if (user === null) {
          res.json({
            message: 'not found'
          })
        } else {
          res.json({
            message: 'found'
          })
        }
      }
  })

}

module.exports = {
    render: render,
    user: user,
    availableUser: availableUser
}
