const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 8000;

// use express router
app.use('/', require('./routers'))
app.use(expressLayouts);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function(err){
    if(err) {
        console.log(`Error in running the server : ${err}`);
    }

    console.log(`Server is running on port : ${port}`);
});


