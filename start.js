
const app = require('./app');
const mongoose = require('mongoose');
require('./models/user');
require('./models/vm');

mongoose.connect("mongodb://vrcloud:vrcloud1@ds145895.mlab.com:45895/vm_monitor", { useNewUrlParser: true });
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

