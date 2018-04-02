var db = require('../database/user')

function accountRender(req, res) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }

    if (!req.session.user) {

        res.render('front/error.ejs', data)
        return
    }

    res.status(200).render('dashboard/account.ejs', data)
}

module.exports = {
    render: accountRender
}