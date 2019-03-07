var http = require('http');
var express = require('express');
var server = express.Router();
var mongodb = require('mongodb');
var mongoURL = "mongodb://vrcloud:vrcloud1@ds145895.mlab.com:45895/vm_monitor";
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {reconnection: true});
const user = mongoose.model('user');
const vm = mongoose.model('vm');
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
    var loggedInUser =
    {
        userName: req.body.userName,
        password: req.body.password,
    }

    var foundUser = user.findOne(
    {
        userName: loggedInUser.userName
    })

    if(foundUser.password == loggedInUser.password)
    {
        res.send(foundUser.id);
    }

    else
    {
        res.send("false");
    }

    //res.send("Request received.");
}),

server.post('/signUp', (req, res) =>
{
	console.log('made it to login route');
    let newUser = new user();
	newUser.userName = req.body.userName;
    newUser.password = req.body.password;
    console.log(req.body.userName);
    console.log(req.body.password);
    newUser.save()
        .then(newUser => {
            res.status(200).json({'user': 'user added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new user failed');
        });

    //res.send("Request received.");
}),

//Return a list of VMs owned by the current user
server.get('/getVM', (req,res) =>
{
    var currentUser = user.findOne(
        {
            userName: req.body.userName
        });

    var vmList;

    var i;
    for(i; i < currentUser.vmsOwned.length; i++)
    {
        var theVM = vm.findOne(
            {
                vmID: currentUser.vmsOwned[i]
            });
        vmList.push(theVM);
    }
    res.send(vmList);
}),

server.post('/create', (req, res) =>
{

    //console.log("Working...");
    console.log(req.body.userName);
    console.log(req.body.type)
    //(vmID, ccID, vmType, eventType, date, fn)
    socket.emit("serverEvent", "Hello!", req.body.userName, req.body.type, "create", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });

}),

server.post('/startServer', (req, res) =>
{
    console.log("Working...");
    socket.emit("serverEvent", "Hello!", req.body.userName, req.body.type, "start", function(data)
    {
        console.log(data);
        res.send(data);

    });

}),

server.post('/stopServer', (req, res) =>
{
    console.log("Working...");
    socket.emit("serverEvent", "Hello!", req.body.userName, req.body.type, "stop", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });

}),

server.get('/deleteServer', (req, res) =>
{
    console.log("Working...");
    socket.emit("serverEvent", "Hello!", req.body.userName, req.body.type, "delete", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });
}),

server.post('/upgradeServer', (req, res) =>
{
    console.log("Working...");
    socket.emit("serverEvent", "Hello!", req.body.userName, req.body.type, "upgrade", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });
    
}),

server.post('/requestUsage', (req, res) =>
{
    console.log("Working...");
    socket.emit("serverEvent", "Hello!", req.body.userName, req.body.type, "requestUsage", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });

}),

server.post('/totalCharges', (req, res) =>
{
    console.log("Working...");
    socket.emit("serverEvent", "Hello!","Hello!", "Hello!", "requestTotalCharges", Date(), function(data)
    {
        console.log(data);
        res.send(data);

    });

});

module.exports = server;