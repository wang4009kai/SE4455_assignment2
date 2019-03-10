var http = require('http');
var express = require('express');
var server = express.Router();
var bodyParser = require('body-parser');
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {reconnection: true});
var cors = require('cors');
var response;

server.use(bodyParser.json());
server.use(cors());

//Connect to resource agent
socket.on('connect', function()
{
    socket.on("clientEvent", function(data)
    {
        response = data;
    })
});

//Handle user login
server.post('/login', (req, res) =>
{
    socket.emit("serverEvent", "Hello!", "Hello!", "Hello!", req.body.userName, req.body.password, req.body.type, "login", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });
}),

//Handle new user sign-up
server.post('/signup', (req, res) =>
{
    console.log("Hello!");
    socket.emit("serverEvent", "Hello!", "Hello!", "Hello!", req.body.userName, req.body.password, req.body.type, "signup", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });
}),

//Return a list of VMs owned by the current user
server.post('/getVM', (req,res) =>
{
    socket.emit("serverEvent", "Hello!", "Hello!", "Hello!", req.body.userName, req.body.password, req.body.type, "getVM", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });
}),

//Handle creating new VM
server.post('/createServer', (req, res) =>
{
    socket.emit("serverEvent", "Hello!", "Hello!", "Hello!", req.body.userName, req.body.password, req.body.type, "create", Date(), function(data)
    {
        console.log(data);

        res.send(data);

    });

}),

//Handle starting selected VM
server.post('/startServer', (req, res) =>
{
    console.log("Working...");
    console.log(req.body.vm);
    socket.emit("serverEvent", "Hello!", "Hello!", req.body.vm, req.body.userName, req.body.password, req.body.type, "start", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });

}),

//Handle stopping selected VM
server.post('/stopServer', (req, res) =>
{
    console.log("Working...");
    console.log(req.body.vm);
    socket.emit("serverEvent", "Hello!", "Hello!", req.body.vm, req.body.userName, req.body.password, req.body.type, "stop", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });

}),

//Handle deleting selected VM
server.post('/deleteServer', (req, res) =>
{
    console.log("Working...");
    socket.emit("serverEvent", "Hello!", "Hello!", req.body.vm, req.body.userName, req.body.password, req.body.type, "delete", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });
}),

//Handle upgrading 
server.post('/upgrade', (req, res) =>
{
    console.log("Working...");
    socket.emit("serverEvent", "Hello!", "Hello!", req.body.vm, req.body.userName, req.body.password, req.body.type, "upgrade", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });
    
}),

//Request usage time for selected VM
server.post('/requestTime', (req, res) =>
{
    console.log("Working...");
    //console.log(req.body.vm);
    console.log(req.body.start);
    socket.emit("serverEvent", req.body.start, req.body.end, req.body.vm, req.body.userName, req.body.password, req.body.type, "requestUsage", Date(), function(data)
    {
        console.log(data);
        res.send("Usage: " + data + " milliseconds.");

    });

}),

//Request total usage charges for current user
server.post('/totalCharges', (req, res) =>
{
    console.log("Working...");
    socket.emit("serverEvent", "Hello!", "Hello!", "Hello!", req.body.userName, "Hello!", "Hello!", "requestTotalCharges", Date(), function(data)
    {
        console.log(data);
        res.send("Cost: $" + data);

    });

});

module.exports = server;