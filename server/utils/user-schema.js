const timestamp = require('time-stamp')

function userSchema(input, session, callback) {

    try {
        const user = {
            name: {
                first: input.first ? input.first : session.name.first,
                last: input.last ? input.last : session.name.last
            },
            email: input.email ? input.email : session.email,
            password: input.password ? input.password : session.password,
            info: {
                age: input.age ? input.age : session.info.age,
                gender: input.gender ? input.gender : session.info.gender,
                place: input.place ? input.place : session.info.place,
                study: input.study,
                work: input.work,
                additional: input.additional,
                image: input.file ? input.file.filename : null,
                lastUpdated: timestamp('DD/MM/YYYY-HH:mm:ss'),
                accountCreated: input.accountCreated ? input.accountCreated : session.info.accountCreated
            },
            preference: {
                sex: input.sex ? input.sex : session.preference.sex,
                ageMin: Number(input.ageMin) ? Number(input.ageMin) : Number(session.preference.ageMin),
                ageMax: Number(input.ageMax) ? Number(input.ageMax) : Number(session.preference.ageMax)
            },
            movies: [
                {
                    name: input.movieOne ? input.movieOne : session.movies[0].name
                },
                {
                    name: input.movieTwo ? input.movieTwo : session.movies[1].name
                }
            ],
            blocked: null
        }

        user.user = user.name.first + ' ' + user.name.last

        callback(user)

    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    user: userSchema
}