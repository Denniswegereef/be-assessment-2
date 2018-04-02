function home(req, res, next) {
    const data = {
        sessionUser: req.session.user,
        data: [],
        error: []
    }

    if(!req.session.user){
        res.render('index.ejs', data)
    } else {
        res.redirect('./dashboard')
    }
}

module.exports = {
    render: home
}