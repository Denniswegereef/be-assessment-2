const argon2 = require('argon2'),
    db = require('../database/connect'),
    chalk = require('chalk')

function render(req, res) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }

    res.status(200).render('front/register.ejs', data)
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
        try {
            if (!user) {
                res.redirect('/')
            } else {
                res.redirect('/dashboard')
            }
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = {
    render: render,
    user: user
}