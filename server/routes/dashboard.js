const mongo = require('mongodb'),
    database = require('../database/user'),
    match = require('../utils/match-system'),
    chalk = require('chalk')

function render(req, res) {

    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }

    if (!req.session.user) {
        data.error = {
            status: 401,
            text: 'No authorization for this page'
        }

        res.status(401).render('front/error.ejs', data)
        return
    }

    database.findAll(done)

    function done(items) {

        match.system(req.session.user, items, doneMatching)

        function doneMatching(matches) {
            data.data = matches

            res.status(200).render('dashboard/dashboard.ejs', data)
        }
    }
}

module.exports = {
    render: render
}
