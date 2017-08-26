var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password:{
        type: String
    },
    email:{
        type: String
    },
    name:{
        type: String
    },
    address_BTC:{
        type: String
    },
    address_ETH:{
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    return User.findOne(query, callback);
}
module.exports.getUserByEmail = function(email,callback) {
    var query = {email: email};
    return User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw new err;
        callback(null, isMatch);
    });
}
module.exports.getAddressesBTCByUsers = function (callback) {
    const usersProjection = {
        _id: false,
        name: false,
        email: false,
        username: false,
        password: false,
        __v: false
    }
    User.find({}, usersProjection, callback);
}
