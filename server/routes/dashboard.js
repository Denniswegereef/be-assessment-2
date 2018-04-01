var mongo = require('mongodb'),
    database = require('../database/user'),
    chalk = require('chalk')

function render(req, res) {

    if (!req.session.user) {
        res.status(401).render('dashboard/error.ejs', {
            user: req.session.user
        })
        return
    }

    database.findAll(done)

    function done(items) {
        res.status(200).render('dashboard/dashboard.ejs', {
            data: items,
            user: req.session.user
        })
    }
}

module.exports = {
    render: render
}
