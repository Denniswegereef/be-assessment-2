function login(req, res) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }
    res.status(200).render('front/log-in.ejs', data)
}

module.exports = {
    render: login
}