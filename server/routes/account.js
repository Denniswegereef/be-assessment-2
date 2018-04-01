var db = require('../database/user')

function render(req, res) {
    if (!req.session.user) {
        res.render('dashboard/error.ejs', {
            user: req.session.user
        })
        return
    }

    var data = {
        user: req.session.user,
        info: []
    }
    var currentUser = req.session.user.username

    db.find({username: currentUser}, done)

    function done(user) {
        data.info = user
        res.render('dashboard/user.ejs', data)
    }
}


// function updateAccount(req, res) {
//     var data = {
//         user: req.session.user,
//         info: []
//     }
//     var currentUser = req.session.user.username
//
//     try {
//         var dbUsers = db.collection('users')
//         dbUsers.updateOne(
//             {username: currentUser},
//             {
//                 $set: {
//                     "name.first": req.body.first,
//                     "name.last": req.body.last
//                 }
//             }
//         )
//     } catch (e) {
//         console.log(e)
//         return
//     }
//     res.redirect('/account')
// }

module.exports = {
    render: render
}