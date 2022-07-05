let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    first_name:String,
    last_name:String,
    email:String,
    password:String,
    password_confirmation:String,
});


let users = mongoose.model('user', userSchema);

module.exports = users;