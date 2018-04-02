const argon2 = require('argon2'),
    db = require('../database/connect'),
    chalk = require('chalk')

function render(req, res) {
    res.render('front/register.ejs', {
        user: req.session.user
    })
}

// Register the user
function user(req, res) {
    req.body.file = req.file

    db.register(req, done)

    function done(user) {
        res.redirect('/dashboard')
    }
}

module.exports = {
    render: render,
    user: user
}