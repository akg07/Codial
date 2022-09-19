const express = require('express');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const env = require('./configs/enviornment');
const logger = require('morgan');

const app = express();
const port = 8000;

const db = require('./configs/mongoose');

// used for session cookie and authentication
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./configs/passport_local_strategy');
const passportJWT = require('./configs/passport-jwt-strategy');
const passportGoogle = require('./configs/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');

const sassMiddleware = require('node-sass-middleware');

const flash = require('connect-flash');
const customMiddleware = require('./configs/middleware');

// setup the chat server to be used with socket.io
const chatServer = require('http').createServer(app);
const chatSockets = require('./configs/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listing on port 5000');

const path = require('path');

// load repeatedly scss in dev env only
if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'expanded',
        prefix: '/css'
    }));
}

app.use(express.urlencoded());
app.use(cookieParser());

// use express router
app.use(expressLayouts);

// for multer file-upload
app.use('/uploads', express.static(__dirname + '/uploads')); // make the uploads path available to the browser

// logger
app.use(logger(env.morgan.mode, env.morgan.options));

// extract style and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static(env.asset_path));


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// mongo store is used to store cookie in db
app.use(session({
    name: 'codial',

    // TODO change the secret before deployment
    secret: env.session_cookie,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100) // session expires after 100 mins
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


