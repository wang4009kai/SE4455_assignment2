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
socket.on('connect', function()
{
    socket.on("clientEvent", function(data)
    {
        console.log("Working2...");
        //socket.emit("serverEvent", "Hello!");
        response = data;
    })
});


server.post('/login', (req, res) =>
{
    socket.emit("serverEvent", "Hello!", "Hello!", "Hello!", req.body.userName, req.body.password, req.body.type, "login", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });
}),

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

server.post('/createServer', (req, res) =>
{

    //console.log("user: " + theUser.userName);
    //console.log("Working...");
    //console.log(req.body.userName);
    //console.log(req.body.type)
    //(vmID, ccID, vmType, eventType, date, fn)
    socket.emit("serverEvent", "Hello!", "Hello!", "Hello!", req.body.userName, req.body.password, req.body.type, "create", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });

}),

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

server.post('/deleteServer', (req, res) =>
{
    console.log("Working...");
    socket.emit("serverEvent", "Hello!", "Hello!", req.body.vm, req.body.userName, req.body.password, req.body.type, "delete", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });
}),

server.post('/upgrade', (req, res) =>
{
    console.log("Working...");
    socket.emit("serverEvent", "Hello!", "Hello!", req.body.vm, req.body.userName, req.body.password, req.body.type, "upgrade", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });
    
}),

server.post('/requestUsage', (req, res) =>
{
    console.log("Working...");
    socket.emit("serverEvent", "Hello!", "Hello!", "Hello!", req.body.userName, req.body.password, req.body.type, "requestUsage", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });

}),

server.post('/totalCharges', (req, res) =>
{
    console.log("Working...");
    socket.emit("serverEvent", "Hello!", "Hello!", "Hello!", req.body.userName, "Hello!", "Hello!", "requestTotalCharges", Date(), function(data)
    {
        console.log(data);
        res.send("Cost: " + data);

    });

});

module.exports = server;