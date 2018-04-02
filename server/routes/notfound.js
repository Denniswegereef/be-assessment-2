function notFound(req, res) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }
    res.status(404).render("front/error.ejs", data)
}

module.exports = {
    render: notFound
}