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

});

module.exports = mongoose.model('vm', vmSchema);