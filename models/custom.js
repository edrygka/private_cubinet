var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = module.exports = mongoose.model('User', UserSchema);
var user = require('../models/users');
var Module = require('../models/index');
const Logger = require('../loger/index');
const logger = new Logger();
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


module.exports.uniqueUser = async function(username,email,callback) {
    var compareData = {};
    compareData.user = await function() {
        return new Promise(function(res,rej) {
            data = user.getUserByUsername(username,function(err,data){
                if(err) throw new err;
                else return data;

            });
            res(data);
        })
    }();
    compareData.email = await function() {
        return new Promise(function(res,rej) {
            data = user.getUserByEmail(email,function(err,data){
                console.log(data)
                if(err) throw new err;

                else return data;
            });
            res(data);
        })
    }();
        console.log(compareData)
    return callback(compareData);
}
module.exports.parseWallets = function(walletName) {
    var query = {
        _id: false,
        name: false,
        email: false,
        username: false,
        password: false,
        address_BTC: true,
        __v: false
    };
    var arr = [];
    console.log('debug');
    new Promise(function(res,rej) {
        user.find({},query,function(err,res) {
            if(err) rej(err);
        });
        res();
    }).then(() => {
        logger.log(arr[0]);
    }).catch()
}
/*
module.exports.getBalance = function(username) {
        return new Promise(async function (res, rej) {
            var userData = await Module.User.getUserByUsername(username, function (err, data) {
                if(err) throw new err;
                else return data;
            });
            var userBalance = {
                balance_BTC: await bit(userData.address_BTC),
                balance_ETH: await ether.getETHbalance(userData.address_ETH)
            }
            userBalance.balance_BTC = await userBalance.balance_BTC.final_balance;
            return res(userBalance);
        });

}*/
