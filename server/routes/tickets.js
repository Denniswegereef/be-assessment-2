const mongo = require('mongodb')
const chalk = require('chalk')
const timestamp = require('time-stamp')


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

    res.status(200).render('dashboard/tickets.ejs', data)
}

function sendTicket(req, res) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }

    // Different kind of status
    // pending / denied / accepted

    const ticket = {
        sender: null,
        receiver: null,
        status: 'send',
        created: null
    }

    try {
        const collection = db.collection('tickets')

        ticket.sender = new mongo.ObjectID(data.sessionUser._id)
        ticket.receiver = new mongo.ObjectID(req.params.id)
        ticket.created = timestamp('DD/MM/YYYY-HH:mm:ss')

        collection.insert(ticket)

        console.log(chalk.green('Sended a ticket for ' + data.sessionUser.user))

    } catch (err) {
        data.error = {
            status: 409,
            text: 'Conflict, something has gone wrong'
        }

        res.status(409).render('front/error.ejs', data)
        console.log(err)
    }

    res.redirect('/user/' + req.params.id)

}

function checkTicket(user, potential, callback) {
    const collection = db.collection('tickets')

    try {
        collection.findOne({'receiver': user}, function (err, result) {
            if (err) {
                return callback('database error')
            }
            return callback(result)

        })

    } catch (err) {
        console.log(err)
    }
}

function getAllTickets(user) {

}

module.exports = {
    render: render,
    send: sendTicket,
    check: checkTicket
}