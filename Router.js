var http = require('http');
var express = require('express');
var server = express.Router();
var mongodb = require('mongodb');
var mongoURL = "mongodb://localhost:27017/db";
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var io = require('socket.io')(3000);

const user = mongoose.model('user');
const vm = mongoose.model('vm');

server.use(bodyParser.json());

server.get('/login', (req, res) =>
{
    var loggedInUser =
    {
        userName: req.body.user,
        password: req.body.password,
    }

    var foundUser = user.findOne(
    {
        userName: loggedInUser.userName
    })

    if(foundUser.password == loggedInUser.password)
    {
        res.redirect('/homePage');
    }

    else
    {
        res.redirect('/login');
    }

    //res.send("Request received.");
}),

server.get('/createServer', (req, res) =>
{
    var response;
    //generate random id
    var id = Math.floor(Math.random()* 10000 + 1);

    var socket = io();
    socket.on('connect', function()
    {
        socket.send('event', id, req.body.id, req.body.vmType, "create", Date(), function(data)
        {
            response = data;
        });
    });

    res.send(response);
}),

server.get('/startServer', (req, res) =>
{
    var response;
    socket.on('connect', function()
    {
        socket.send('event', req.body.vmID, req.body.id, req.body.vmType, "start", Date(), function(data)
        {
            response = data;
        });
    });

    res.send(response);

}),

server.get('/stopServer', (req, res) =>
{
    var response;
    socket.on('connect', function()
    {
        socket.send('event', req.body.vmID, req.body.id, req.body.vmType, "stop", Date(), function(data)
        {
            response = data;
        });
    });

    res.send(response);

}),

server.get('/deleteServer', (req, res) =>
{
    var response;
    socket.on('connect', function()
    {
        socket.send('event', req.body.vmID, req.body.id, req.body.vmType, "delete", Date(), function(data)
        {
            response = data;
        });
    });

    res.send(response);

}),

server.get('/upgradeServer', (req, res) =>
{
    var response;
    socket.on('connect', function()
    {
        socket.send('event', req.body.vmID, req.body.id, req.body.vmType, "upgrade", Date(), function(data)
        {
            response = data;
        });
    });

    res.send(response);
    
}),

server.get('/requestUsage', (req, res) =>
{
    

}),

server.get('/totalCharges', (req, res) =>
{
    res.send("Request received.");

});

module.exports = server;