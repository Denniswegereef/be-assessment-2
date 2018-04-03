const db = require('../database/user'),
    mongo = require('mongodb'),
    chalk = require('chalk'),
    ticket = require('../routes/tickets')



function render(req, res) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }

    const checkObjectID = new RegExp("^[0-9a-fA-F]{24}$") // Thanks https://stackoverflow.com/questions/11985228/mongodb-node-check-if-objectid-is-valid

    if (!checkObjectID.test(req.params.id)){
        console.log(chalk.red('No user found with slug ' + req.params.id))
        data.error = {
            status: 400,
            text: 'User not found'
        }
        res.status(404).render('front/error.ejs', data)
    } else {
        const userID = new mongo.ObjectID(req.params.id)

        db.find({_id: userID}, done)

        function done(user) {
            data.data = user

            ticket.check(userID, user, done)
            function done(ticket) {
                data.ticket = ticket
                res.status(200).render('dashboard/user.ejs', data)
            }
        }
    }
}

module.exports = {
    render: render
}