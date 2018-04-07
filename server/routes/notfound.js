function notFound(req, res) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }
    data.error = {
        status: 404,
        text: 'Page not found'
    }
    res.status(404).render("front/error.ejs", data)
}

module.exports = {
    render: notFound
}