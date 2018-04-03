const chalk = require('chalk')

function matchsystem(currentUser, potential, callback) {
    const maxMatches = 3
    const matches = []
    potential.forEach(function (user) {
        if (currentUser.preference.sex === user.info.gender && user.preference.sex === currentUser.info.gender) {
            if (currentUser.preference.ageMin <= user.info.age && currentUser.preference.ageMax >= user.info.age) {
                if (user.preference.ageMin <= currentUser.info.age && user.preference.ageMax >= currentUser.info.age) {
                    if (user.length > maxMatches) {
                        return
                    } else {
                        matches.push(user)
                    }
                }
            }
        }
    })
    console.log(chalk.magenta('Found ' + matches.length + ' matches for ' + currentUser.user ))
    return callback(matches)
}

module.exports = {
    system: matchsystem
}