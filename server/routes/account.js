var db = require('../database/user')

function accountRender(req, res) {
    if (!req.session.user) {
        res.render('dashboard/error.ejs', {
            user: req.session.user
        })
        return
    }

    res.render('dashboard/account.ejs', {
        user: req.session.user
    })
}


module.exports = {
    render: accountRender
}