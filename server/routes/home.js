function home(req, res, next) {

    if(!req.session.user){
        res.render('index.ejs', {
            user: req.session.user
        })
    } else {
        res.redirect('./dashboard')
    }
}

module.exports = {
    render: home
}