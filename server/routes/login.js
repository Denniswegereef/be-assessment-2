function login(req, res) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }
    res.render('front/log-in.ejs', data)
}

module.exports = {
    render: login
}