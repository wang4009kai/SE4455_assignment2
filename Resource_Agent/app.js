const express = require('express');
const router = require('./Router');
const app = express();
app.use('/', router);

module.exports = app;
