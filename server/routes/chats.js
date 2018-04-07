function render(req, res) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }
    if(!data.sessionUser) {
        data.error = {
            status: 401,
            text: 'No authorization for this page'
        }
        res.status(401).render('front/error.ejs', data)
    }
    res.status(200).render('dashboard/chats.ejs', data)
}

module.exports = {
    render: render
}