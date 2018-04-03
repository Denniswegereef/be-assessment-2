function render(req, res) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }

    res.render('dashboard/chats.ejs', data)
}

module.exports = {
    render: render
}