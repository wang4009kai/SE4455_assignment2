//This is the resource agent
const express = require('express');
const app = express();
var resourceAgent = require('http').Server(app);
var socket1 = require('socket.io')(resourceAgent);
var user = require('../models/user');
var vm = require('../models/vm');
resourceAgent.listen(3000);

socket1.on('connection', function(socket)
{
    socket.on('event', function(vmID, ccID, vmType, eventType, timeStamp, fn)
    {
        //Create Server Message
        if(eventType == "create")
        {
            //generate random id
            var id = Math.floor(Math.random()* 10000 + 1);

            var id1 = vm.findOne(
            {
                vmID: id
            })
        
            while(id == id1)
            {
                id =  Math.floor(Math.random()* 10000 + 1);
                id1 = vm.findOne(
                {
                    vmID: id
                }
                )
            }
        
            var newVM = new vm(id, req.body.cc, req.body.template);
            newVM.save();
        }

        else if(eventType == "start")
        {
            var id = vm.findOne(
                {
                    vmID: vmID
                }
            )

            //Add start timestamp to list of timestamps
        }

        
        else if(eventType == "stop")
        {
            var id = vm.findOne(
                {
                    vmID: vmID
                }
            )

            //Add stop timestamp to list of timestamps
        }

        
        else if(eventType == "delete")
        {
            var id = vm.findOne(
                {
                    vmID: vmID
                }
            )

            //Think about what to do here
        }

        
        else if(eventType == "upgrade")
        {
            var id = vm.findOne(
                {
                    vmID: vmID
                }
            )

            //Add upgrade timestamp

            id.vmType = vmType;
            id.save();
        }

        else if(eventType == "requestUsage")
        {
            var id = vm.findOne(
                {
                    vmID: vmID
                }
            )


        


        }

        else if(eventType == "requestTotalCharges")
        {
            var customer = user.findOne(
                {
                    userName: ccID
                }
            )
            
            //Get all the VM data + send back charges
        }

    })
    
})
module.exports = app;
