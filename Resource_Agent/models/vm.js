const mongoose = require('mongoose');

const vmSchema = new mongoose.Schema({
    vmID: 
    {
        type: String
    },

    ccID:
    {
        type: String
    },

    vmType:
    {
        type: String
    },

    timeStampStart:
    [{
        type: Date
    }],

    timeStampStop:
    [{
        type: Date
    }],

    timeStampType:
    [{
        type: String
    }],

    vmStatus:
    {
        type: String
    },

    /*timeStamps:
    [
        {
            vmtypes:
            {
                type: String
            },
            vmStartTimeStamp:
            {
                type: Date
            },

            vmStopTimeStamp:
            {
                type:Date
            }
        },
    ]*/
});

module.exports = mongoose.model('vm', vmSchema);