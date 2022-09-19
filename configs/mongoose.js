const mongoose = require('mongoose');
const env = require('./enviornment');

mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to mongo db'));

db.once('open', function() {
    console.log('connected to database :: MongoDB');
})


module.exports = db;