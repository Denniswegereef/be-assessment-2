function notFound(req, res) {
    res.status(404).render("front/error.ejs", {
        user: req.session.user
    })
}

module.exports = {
    render: notFound
}