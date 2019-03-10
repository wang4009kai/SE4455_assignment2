var http = require('http');
var express = require('express');
var app = express.Router();
var mongodb = require('mongodb');
var mongoURL = "mongodb://vrcloud:vrcloud1@ds145895.mlab.com:45895/vm_monitor";
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var socket1 = require('socket.io').listen(3000);
const user = mongoose.model('user');
const vm = mongoose.model('vm');
var cors = require('cors');
var response;


socket1.on('connection', function(socket)
{
    console.log("Working1...");
    socket.on("serverEvent", function(vmID, ccID, ccPassword, vmType, eventType, date, fn)
    {
        
        if(eventType == "login")
        {
            var loggedInUser =
            {
                userName: ccID,
                password: ccPassword,
            }
        
            console.log(loggedInUser.userName);
            console.log(loggedInUser.password);

            var theUser;

            user.findOne({userName: ccID}, function(err, someUser)
            {
                if(someUser)
                {
                    console.log("Hello: " + someUser);
                    if(someUser.password == loggedInUser.password)
                    {
                        fn(someUser.userName);
                    }
                    
                    else
                    {
                        fn(false);
                    }
                }

                else
                {
                    console.log(false);    
                }
            });

        }

        else if(eventType == "signup")
        {
            console.log('made it to login route');
            let newUser = new user();
            newUser.userName = ccID;
            newUser.password = ccPassword;
            console.log(ccID);
            console.log(ccPassword);
            newUser.save()
                .then(newUser => {
                    fn('user added successfully');
                })
                .catch(err => {
                    fn('adding new user failed');
                });
        //res.send("Request received.");
        }

        else if(eventType == "getVM")
        {
            user.findOne({userName: ccID}, function(err, someUser)
            {
                if(someUser)
                {
                    var vmList = [];
                    var i = 0;
                    for(i; i < someUser.vmsOwned.length; i++)
                    {
                        
                        vm.findOne({vmID: someUser.vmsOwned[i]}, function(err, someVM)
                            {
                                if(someVM)
                                {
                                    console.log(someVM.vmID);
                                    vmList.push(someVM);
                                    //console.log("VM list length:" + vmList.length);
                                  
                                    if(someVM.vmID == someUser.vmsOwned[someUser.vmsOwned.length-1])
                                    {
                                        console.log("Working...");
                                        fn(vmList);
                                    }
                                }
                            });
                        
                    }

                }
                else
                {
                    fn("error");
                }
            });

        }

        else if(eventType == "create")
        {
            console.log("Working...");
            //generate random id
            var id = Math.floor(Math.random()* 10000 + 1);
            var queryPromise = user.findOne({userName: ccID}).exec();
        
            queryPromise.then(
                function(someUser)
                {
                    console.log("Hello: " + someUser);
                    
                    /*vm.findOne({vmID: id}, function(err, someVM)
                    {
                      if(someVM.id == id)
                      {

                      }
                    });*/
                                
            var vmData = {"vmID": id, "ccID": ccID, "vmType": vmType};
            //console.log(vmData.vmID);
            var newVM = new vm(vmData);
            //console.log("Name: " + theUser.userName);
            //console.log("User: " + ccID);
           // console.log("User2: " + theUser.userName);
            someUser.vmsOwned.push(id);
            newVM.save();
            someUser.save();
            console.log("new vm created" + id);
            fn(newVM);

                }
            );
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
