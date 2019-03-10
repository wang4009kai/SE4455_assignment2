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
    socket.on("serverEvent", function(start, stop, vmID, ccID, ccPassword, vmType, eventType, date, fn)
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
                    var vmData = {"vmID": id, "ccID": ccID, "vmType": vmType};
                    var newVM = new vm(vmData);
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
            vm.findOne({vmID: vmID}, function(err, theVM)
            {
                if(theVM)
                {
                    theVM.timeStampStart.push(Date());
                    theVM.save();
                    fn("VM started");
                }
                else
                {
                    console.log("Error finding VM.")    
                }
                //fn("completed");
            });
        }

        //Add stop timestamp and type to list of timestamps
        else if(eventType == "stop")
        {
            console.log("Working...");
            vm.findOne({vmID: vmID}, function(err, theVM)
            {
                if(theVM)
                {
                    theVM.timeStampStop.push(Date());
                    theVM.timeStampType.push(theVM.vmType);
                    theVM.save();
                    fn("VM stopped");
                }
                else
                {
                    console.log("Error finding VM.")    
                }
            });
        }

        //Delete the VM
        else if(eventType == "delete")
        {
            vm.findOne({vmID: vmID}, function(err, theVM)
            {
                console.log("Deleting vm");
                theVM.delete();
                fn("Deleted the VM.");
            });

        }

        //Change the VM type + save time stamps
        else if(eventType == "upgrade")
        {
            vm.findOne({vmID: vmID}, function(err, theVM)
            {
                theVM.timeStampStop.push(Date());
                theVM.vmType = vmType;
                theVM.timeStampStart.push(Date());
                theVM.save();
                fn("VM upgraded.");
            });
        }

        //Add up the usage and return
        else if(eventType == "requestUsage")
        {
            var id = vm.findOne({vmID: vmID}, function(err, theVM)
            {
                var i;
                var usage;
                for(i = 0; i < theVM.timeStampStop.length; i++)
                {
                    if(start > theVM.timeStampStart[i] && start < theVM.timeStampStop[i])
                    {
                        if(stop > timeStampStop[i])
                        {
                            usage += timeStampStop[i] - start;
                        }

                        else
                        {
                            usage += stop - start;
                        }
                        
                    }
                }
                fn(usage);
            });   
        }

        //Add up charges for all vms owned by customer and return
        else if(eventType == "requestTotalCharges")
        {
                user.findOne({userName: ccID}, function(err, someUser)
                {

                    var i;
                    var totalCharge = 0;
                    if(someUser)
                    {
                        for(i = 0; i < someUser.vmsOwned.length; i++)    
                        {
                            vm.findOne({vmID: someUser.vmsOwned[i]}, function(err, theVM)
                            {
                                  
                                var j;
                                
                                for(j = 0; j < theVM.timeStampStop.length; j++)
                                {
                                    totalCharge += theVM.timeStampStop[j] - theVM.timeStampStart[j];
                                    console.log(totalCharge);
                                    if(theVM.vmID == someUser.vmsOwned[someUser.vmsOwned.length-1])
                                    {
                                        console.log("Working" + totalCharge);
                                        fn(totalCharge);
                                    }
                                    
                                }
                                });
            
                        }      
                    }

                });
        
        }

    })
    
})
module.exports = app;
