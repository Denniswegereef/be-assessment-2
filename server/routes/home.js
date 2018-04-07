const database = require('../database/user')

    function
home(req, res, next)
{
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }

    if (!req.session.user) {

        database.findAll(done)

        function done(users) {
            data.data = users.length
            res.render('index.ejs', data)
        }

    } else {
        res.redirect('./dashboard')
    }
}

module.exports = {
    render: home
}