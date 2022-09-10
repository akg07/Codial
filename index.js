const express = require('express');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./configs/mongoose');

// used for session cookie and authentication
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./configs/passport_local_strategy');
const MongoStore = require('connect-mongo');

const sassMiddleware = require('node-sass-middleware');

const flash = require('connect-flash');
const customMiddleware = require('./configs/middleware');

const app = express();
const port = 8000;

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'expanded',
    prefix: '/css'
}));

app.use(express.urlencoded());
app.use(cookieParser());

// use express router
app.use(expressLayouts);

// extract style and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static('./assets'));


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// mongo store is used to store cookie in db
app.use(session({
    name: 'codial',

    // TODO change the secret before deployment
    secret: 'blahSomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/codial_dev',
        autoRemove: 'disabled'
    })
    
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleware.setFlash);

app.use('/', require('./routers')); // router should be last statement in the script

app.listen(port, function(err){
    if(err) {
        console.log(`Error in running the server : ${err}`);
    }

    console.log(`Server is running on port : ${port}`);
});


