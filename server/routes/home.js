function home(req, res, next) {
    let data = {
        name: 'dennis'
    }

    res.render('index.ejs', {
        user: req.session.user
    })
}

module.exports = {
    render: home
}