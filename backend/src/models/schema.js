const mongoose = require('mongoose');
const UserSchema=mongoose.Schema({
    messages:{
        type:String,
        
    }

})
const Register=mongoose.model('Messages',UserSchema)
module.exports=Register;
