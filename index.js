const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const db = require('./configs/mongoose');
const app = express();
const port = 8000;

// use express router
app.use(expressLayouts);

// extract style and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static('./assets'));
app.use('/', require('./routers')); // router should be last statement in the script

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function(err){
    if(err) {
        console.log(`Error in running the server : ${err}`);
    }

    console.log(`Server is running on port : ${port}`);
});


