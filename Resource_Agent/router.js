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
                                    console.log(someVM);
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
            
            vm.findOne({vmID: id}, function(err, theVM)
            {
                if(theVM)
                {
                    fn(false);
                }
            });
            queryPromise.then(
                function(someUser)
                { 
                    var vmData = {"vmID": id, "ccID": ccID, "vmType": vmType, "vmStatus": "Stopped"};
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
                    theVM.vmStatus = "Started";
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
                    theVM.vmStatus = "Stopped";
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
                user.findOne({userName: ccID}, function(err, someUser)
                {
                    var i;
                    for(i = 0; i < someUser.vmsOwned.length; i++)
                    {
                        if(someUser.vmsOwned[i] == theVM.vmID)
                        {
                            console.log(i);
                            someUser.vmsOwned.splice(i);
                            someUser.save();
                            theVM.delete();
                            fn("Deleted the VM.");
                        }
                    }
                });
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
            vm.findOne({vmID: vmID}, function(err, theVM)
            {
                var i;
                var usage = 0;
                var startDate2 = start.split("-");
                var startDate = new Date(startDate2[0], startDate2[1] - 1, startDate2[2]);

                var stopDate2 = stop.split("-");
                var stopDate = new Date(stopDate2[0], stopDate2[1] - 1, stopDate2[2]);

                console.log(startDate);
                console.log(stopDate);
                if(theVM)
                {
                   
                    //console.log(theVM.vmID);
                    //console.log(theVM.timeStampStop.length);
                    for(i = 0; i < theVM.timeStampStop.length; i++)
                    {
                        //console.log("not working...")
                        if(startDate > theVM.timeStampStart[i] && startDate < theVM.timeStampStop[i])
                        {
                            console.log("This is working.");
                            if(stopDate > theVM.timeStampStop[i])
                            {
                                var num = Math.abs(theVM.timeStampStop[i].getTime() - startDate.getTime());
                                usage += num;
                                console.log(usage);
                                //console.log("Hello: " + Math.abs(theVM.timeStampStop[i].getTime() - startDate.getTime()));
                            }
    
                            else
                            {
                                var num = Math.abs(stopDate.getTime() - startDate.getTime());
                                usage += num;
                                console.log(usage);
                            }
                            
                        }

                        else if(startDate < theVM.timeStampStart[i] && stopDate > theVM.timeStampStart[i])
                        {
                            console.log("This is working.");
                            if(stopDate > theVM.timeStampStop[i])
                            {
                                var num = Math.abs(theVM.timeStampStart[i].getTime() - theVM.timeStampStop[i].getTime());
                                usage += num;
                                console.log(usage);
                                //console.log("Hello: " + Math.abs(theVM.timeStampStop[i].getTime() - startDate.getTime()));
                            }

                            else
                            {
                                var num = Math.abs(stopDate.getTime() - theVM.timeStampStart[i].getTime());
                                usage += num
                                console.log(usage);
                            }
                        }

                        else
                        {
                            //console.log("not working2 ");
                        }
                    }
                    fn(usage);
                }
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
                                if(theVM)
                                {
                                    for(j = 0; j < theVM.timeStampStop.length; j++)
                                    {
                                        if(theVM.timeStampType[i] == "basic")
                                        {
                                            totalCharge += (theVM.timeStampStop[j] - theVM.timeStampStart[j]) * 0.01;
                                        }

                                        else if(theVM.timeStampType[i] == "large")
                                        {
                                            totalCharge += (theVM.timeStampStop[j] - theVM.timeStampStart[j])*0.1;
                                        }

                                        else
                                        {
                                            totalCharge += (theVM.timeStampStop[j] - theVM.timeStampStart[j]);
                                        }
                                        
                                        console.log(totalCharge);
                                        if(theVM.vmID == someUser.vmsOwned[someUser.vmsOwned.length-1])
                                        {
                                            console.log("Working" + totalCharge);
                                            fn(totalCharge);
                                        }
                                        
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
