var db = require('../database/user'),
    mongo = require('mongodb')

function render(req, res) {
    var userID = new mongo.ObjectID(req.params.id)
    var data = {
        user: req.session.user,
        info: []
    }

    db.find({_id: userID}, done)

    function done(user) {
        data.user = user
        res.render('dashboard/user.ejs', data)
    }
}

module.exports = {
    render: render
}