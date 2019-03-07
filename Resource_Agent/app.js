//This is the resource agent
const express = require('express');
const app = express();
var resourceAgent = require('http').Server(app);
var socket1 = require('socket.io').listen(3000);
var user = require('../models/user');
var vm = require('../models/vm');

socket1.on('connection', function(socket)
{
    console.log("Working1...");
    socket.on("serverEvent", function(vmID, ccID, vmType, eventType, date, fn)
    {
        
        
        if(eventType == "create")
        {
            console.log("Working...");
            //generate random id
            var id = Math.floor(Math.random()* 10000 + 1);

            var theUser = user.findOne(
                {
                    userName: ccID
                }
            )

            var id1 = vm.findOne(
            {
                vmID: id
            })
        
            while(id == id1)
            {
                console.log("Working...");
                id =  Math.floor(Math.random()* 10000 + 1);
                id1 = vm.findOne(
                {
                    vmID: id
                }
                )
            }

            
            var vmData = {"vmID": id, "ccID": ccID, "vmType": vmType};
            //console.log(vmData.vmID);
            var newVM = new vm(vmData);
            console.log(theUser.userName);
            theUser.vmsOwned.push(id);
            newVM.save();
            fn(newVM);
        }
        
        //Add start timestamp to list of timestamps
        else if(eventType == "start")
        {
            console.log("Working...");
            var theVM = vm.findOne(
                {
                    vmID: vmID
                }
            )

            theVM.timeStampStart.push(Date());
            theVM.save();
            fn("VM started");
        }

        //Add stop timestamp and type to list of timestamps
        else if(eventType == "stop")
        {
            var theVM = vm.findOne(
                {
                    vmID: vmID
                }
            )

            theVM.timeStampStop.push(Date());
            theVM.timeStampType.push(vmType);
            theVM.save();
            fn("VM stopped");
        }

        //Delete the VM
        else if(eventType == "delete")
        {
            var theVM = vm.findOne(
                {
                    vmID: vmID
                }
            )

            vm.remove(theVM);
            fn("VM deleted");
        }

        //Change the VM type + save time stamps
        else if(eventType == "upgrade")
        {
            var theVM = vm.findOne(
                {
                    vmID: vmID
                }
            )

            theVM.timeStampStop.push(Date());
            theVM.vmType = vmType;
            theVM.timeStampStart.push(Date());
            theVM.save();
            fn("VM upgraded.");
        }

        //Add up the usage and return
        else if(eventType == "requestUsage")
        {
            var id = vm.findOne(
                {
                    vmID: vmID
                }
            )

            var i;
            var usage;
            for(i = 0; i < timeStampStop.length; i++)
            {
                usage += timeStampStop[i] - timeStampStart[i];
            }
            fn(usage);
        }

        //Add up charges for all vms owned by customer and return
        else if(eventType == "requestTotalCharges")
        {
            var customer = user.findOne(
                {
                    userName: ccID
                }
            )

            var i;
            var totalCharge;
            for(i = 0; i < customer.vmsOwned.length; i++)    
            {
                var theVM = vm.findOne(
                    {
                        vmID: customer.vmsOwned[i]
                    }
                )

                var j;

                for(j = 0; j < theVM.timeStampStop.length; j++)
                {
                    totalCharge += theVM.timeStampStop[j] - theVM.timeStampStart[j];
                }

            }      
            
            fn(totalCharge);
        
        }

    })
    
})
module.exports = app;
