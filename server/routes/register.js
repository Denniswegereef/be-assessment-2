var argon2 = require('argon2'),
    db = require('../database/connect')

function render(req, res) {
    res.render('front/register.ejs', {
        user: req.session.user
    })
}

function user(req, res) {

    db.register(req, done)

    function done(user) {
        res.redirect('/dashboard')
    }
}

module.exports = {
    render: render,
    user: user
}