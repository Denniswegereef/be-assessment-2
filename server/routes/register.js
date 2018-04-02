const argon2 = require('argon2'),
    db = require('../database/connect'),
    chalk = require('chalk')

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

    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }

    db.register(req, done)

    function done(user) {
        res.redirect('/dashboard')
    }
}

module.exports = {
    render: render,
    user: user
}