const mongoose = require('mongoose');


const roleSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Role', roleSchema);