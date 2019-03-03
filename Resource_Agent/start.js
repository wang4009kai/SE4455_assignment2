const app = require('./app');
const mongoose = require('mongoose');
require('../models/user');
require('../models/vm');

mongoose.connect("mongodb://localhost:27017/db", {useMongoClient: false});
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () =>
{
    console.log("Connected to Database")
})
.on('error', (err) => {
    console.log("Error connecting");
})

const server = app.listen(8080, () =>
{
console.log('listening');
});