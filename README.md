# be-assessment-2

_Table of content_
- Screenshot op top
- Movie dating
- How to install
- Technology used
- How it is structured 
    - Files
    - Database
- Add a to-do list [x] check
- Personal opinion


## Movie dating

This web app is created for people who love to find their second half.
Specially made for people have a passion for series and films and would like to find someone to share it with!

The idea is that people can specify their favourite movies and series. Based on that information it can search people who have have same interested in the series and movies. So it can help you find your other half.

## Technology used 

## How to install

*To install you need to follow a few steps to get it up and running.*

First `cd` to the file you want to install it in on your machine

Than run the following command to clone it
```bash
clone https://github.com/Denniswegereef/be-assessment-2.git
```

Install [MongoDB](https://www.mongodb.com/) to use as a database for the app

*You need to do a couple of steps to get it running*

First you need open bash have [Homebrew](https://brew.sh/index_nl) _see on their page how to install it_
```bash
brew install mongodb
brew services start mongodb

```

Make a directory in the project folder, use bash in another tab and do:
```bash
mkdir db
mongod --dbpath db
```

Back to our original opened tab, open the [mongo shell](https://docs.mongodb.com/getting-started/shell/client/) with:
```bash
mongo
use dating-db
db.runCommand( { create: "users" } )
db.runCommand( { create: "tickets" } )
```

Now we have our database with the name `datint-db` with 2 collections `users` and `tickets` to store the data in!

`cd` to the root of your proejct create a .env file where you store your secret database info
```bash
touch .env
echo "
DB_HOST=localhost
DB_PORT=27017
DB_NAME=dating-db
SESSION_SECRET=thisisstillasecret
" >> .env
```

As last we have to build our project with
```bash
npm install
gulp
```

You can visit your freshly created website on `localhost:8080`


### Structure

You just have installed all the files and I'll give you a quick tour to them

- The server totally depends on everything that stands in the `server` directory.
First there is the `index.js` where everything comes together
- All the different routes are in the `routes` directory.
- In the `database` directory you have access to different kind of functions to connect with the database.
Things like get a user, or get all users they all provide a callback what is created in the `connect.js` and `user.js` files.
- In `utils` there is the `match-system.js` what kinda does the thinking on the `dashboard` page to find right matches for the user.
- There is also the user schema what has some kind of logic that always get updated to the database without naming something different, and if the value is empty it just adds the `current sessoin` data .

You can do a call to the database information with:
```js
const userID = new mongo.ObjectID(req.params.id) // create a new mongo ObjectID of the id of a user

db.find({_id: userID}, done) // Find an _id with the userID in the database

function done(user) { // create a callback
    console.log(chalk.blue(user)) // The specific user data that just was requested!
}
``` 

There are some other functions available within the server:
But first you have to require the specific file to make use of the function
```js
const db = require('../database/user')
``` 
- `db.find({key: userID}, done)` find a user in database with a specific key and a value you wanna find them
- `database.findAll(done)` only needs a callback
- `db.update(updated data, data.sessionUser, done)` needs 3 things to work, the data that's been updated for the user, the session of the user and a callback.




## To-do list

- [x] Let people find only users who are in their range, and in the users range
- [x] Rewrite everything into modular files
- [ ] A ticket system where people can share interested for other users _currently working on it_
- [ ] Client side error handling for the users
- [ ] Let people chat with with the help of [SOCKET IO](https://socket.io/) or something else..
- [ ] Let people choose movies from the [OMDb API](http://www.omdbapi.com/)
- [ ] Create a algorithm? who matches the users based on their favourite movies and series

## Personal opinion
