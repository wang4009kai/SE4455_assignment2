const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: 
    {
        type: String
    },

    password:
    {
        type: String
    },

    id:
    {
        type: Number
    },

    vmsOwned:
    {
        type: Number
    }
});

module.exports = mongoose.model('user', userSchema);