const express = require('express');
require('./models/user');
require('./models/vm');
const router = require('./Router');
const app = express();
app.use('/', router);

module.exports = app;
