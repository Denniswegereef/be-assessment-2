function login(req, res) {
    res.render('front/log-in.ejs', {
        user: req.session.user
    })
}

module.exports = {
    render: login
}