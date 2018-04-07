# be-assessment-2 :construction_worker:

_Table of content_
- [Movie dating](#movie-dating)
- [How to install](#how-to-install)
- [File structure](#file-structure)
- [Technology used](#technology-used)
- [To-do list](#to-do-list)
- [Personal opinion](#personal-opinion)

Screenshot

## Movie dating

This web app is created for people who love to find their second half.
Specially made for people have a passion for series and films and would like to find someone to share it with!

The idea is that people can specify their favourite movies and series. Based on that information it can search people who have have same interested in the series and movies. So it can help you find your other half.

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

At last we have to build our project with
```bash
npm install
gulp
```

You can visit your freshly created website on `localhost:8080`


### File structure

You just have installed all the files and I'll give you a quick tour to them

#### Server
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
- `db.find({key: userID}, done)` find a user in database with a specific key and a value you wanna find them, than give it a callback
- `database.findAll(done)` only needs a callback
- `db.update(updated data, data.sessionUser, done)` needs 3 things to work, the data that's been updated for the user, the session of the user and a callback.


```js
const connect = require('../database/connect')
``` 

- `connect.register(req, done)` needs the request, and gives the callback done
- `connect.login(req, res)` is available but not tested yet outside a post request in express
- `connect.remove(req, res)` is a little different, you can remove a user from the database if you follow the `localhost:8080/remove/userID` be aware it does remove it without confirmation on the back-end, that is up to whatever is build in the front-end
- `connect.logout(req, res)` requires a request and a response object to logout the current session


```js
const ticket = require('../routes/tickets')
``` 

- An unfinished part of the app, for now it can only create a ticket
- In the future you can send out a ticket, and handle it with `pending`, `accepted`, `denied` *not working for now*

#### Src (source)
The source has 3 main folders `images`, `scss` and `view`.

- The `images` folder is where the users store their images in the folder `images/users`, there is a `profile-placehlder.jpg` inside where if a user didn't choose one he has the placeholder.
It also contains the icons and possible other images

- The `scss` folder contains all the sass files ready to be compiled.
In the end you have to specify everything in the `main.scss` what has to be compiled to the browser

- The `view` folder has al the EJS templates, starting with the `index.js` where the `/` is hosted on.
Other than that it has the `front` folder what includes the `register`, `log-in` and `error` page.
There is also a dashboard folder where all the templates are stored in when a user is logged-in!
At last there is the `component` folder which includes such things like the `header` and `footer` what comes back every page.

#### Static

The file where everything gets deployed it so the browser can read it properly thanks to express static!
Also gulp generates the css and javascript files into the static so it is available to use.  

### Database structure

For now the database contains 2 collections with `users` and `tickets`, as stated above tickets can only create a ticket between the `current user` and `user` he or she is sending to.

For inserting a user into the database it requires the `user-schema.js` in the server/utils folder.
It has a nice markup what kind of data is stored in the database.

The markup in the database looks like this
```js
        userSchema = {
            user: 'Dennis Wegereef',
            name: {
                first: 'Dennis',
                last: 'Wegereef'
            },
            email: 'email@email.nl',
            password: 'hashed password',
            info: {
                age: '18',
                gender: 'Male',
                place: 'Amsterdam',
                study: 'Communcation multimedia design',
                work: 'all-round at Outsole.nl',
                additional: 'I like dogs more than cats (sorry!)',
                image: '70cdf03ff7f92ba27b408293ebcf278c',
                lastUpdated: '05/04/2018-16:07:42',
                accountCreated: '05/04/2018-16:07:42'
            },
            preference: {
                sex: 'Female',
                ageMin: 18,
                ageMax: 25
            },
            movies: [
                {
                    name: 'Lord of the rings'
                },
                {
                    name: 'Star wars'
                }
            ],
            blocked: null,
        }
``` 

Couple of things notable here:
- The `user` get generated dynamically based of the `name.first` and `name.last`   
- Every time the user updates his account the lastUpdated automaticly with [Time-stamp](https://www.npmjs.com/package/time-stamp) in the format `'DD/MM/YYYY-HH:mm:ss'`
- Same goes for accountCreated but only once
- The image is renamed to a unreadable and more easy stored name with [Multer](https://github.com/expressjs/multer)
- The password is hashed due the help of [Argon2](https://www.npmjs.com/package/argon2)
- Currently the `movies` is not that big, but in the future it should add a-lot more data to it to find a suitable match 


## Technology used 

For this project I used:
- [Node.js](https://nodejs.org/en/) the base where my project is made in
    - [Chalk](https://github.com/chalk/chalk) for making cool colors in the terminal to ready it more easy during development
    - [Argon2](https://www.npmjs.com/package/argon2) for saving my passwords more secure
    - [Body paser](https://github.com/expressjs/body-parser) used to handle all the posts request from forms
    - [Multer](https://github.com/expressjs/multer) used to parse my images through the form
    - [Time-stamp](https://www.npmjs.com/package/time-stamp) for creating timestamps
    - [Dontenv](https://www.npmjs.com/package/dotenv) I've used this to save local your secret keys without leaking to the outside
    - [Nodemon]() made my life alot more easy without restarting node everytime
- [Express](https://www.express.com/) on top of node to make everything more easy and readable
   -[Express-session](https://github.com/remy/nodemon)
- [EJS](http://ejs.co/) Effective JavaScript templating, where all the html get's generated.
- [MongoDB]()
- [Sass](https://sass-lang.com/) for writing more maintainabile css, although it could still use some work :sweat_smile:
- [Gulp](https://gulpjs.com/) for compling sass to css what the browser can read

## To-do list

- [x] Make the register, log-in and sessions to work
- [x] Let people find only users who are in their range, and in the users range
- [x] Rewrite everything into modular files
- [ ] A ticket system where people can share interested for other users _currently working on it_
- [ ] Client side error handling for the users
- [ ] Let people chat with with the help of [SOCKET IO](https://socket.io/) or something else..
- [ ] Let people choose movies from the [OMDb API](http://www.omdbapi.com/)
- [ ] Create a algorithm? who matches the users based on their favourite movies and series

## Personal opinion

Let's first start with the fact that I've learned a-lot! I didn't know you could do any of these things and now I can manage them after a couple weeks it was a high learning curve in my opinion.
The start everything was kinda rough, since you head to learn something totally new. But later in the weeks I got the hand of it and started helping other peop;e.

I had really much fun of trying different things out and find what worked and what not. Sometimes when something didn't work the way I would like to I just landed stuck for maby a couple of hours/a day.
But invested so much time in learning it and know how to handle most of the things in the last-week I was kinda happy with what I had.

But when I look back on everything I've made I'm still very disappointed with the amount of features there are. The more I was involved in the project and the more I learned, I also learned that so much things could have been wrote better with better error-handling and things I didn't think of in the first hand.

For now I'm happy with the result that I can show at the assignment and made *a-lot* of progress!


  