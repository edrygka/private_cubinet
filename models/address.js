//Model of Users Address
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Logger = require('../loger/index');
const logger = new Logger();
const UserAddressScheme = new mongoose.Schema({
    public_key_ETH: {
        type: String
    },
    public_key_BTC: {
        type: String
    },
    user_id: {
        type: String
    },
    balance_ETH:{
        type: Number
    },
    balance_BTC:{
        type: Number
    }
})

const Address = module.exports = mongoose.model('Address', UserAddressScheme)

module.exports.createAddress = function (newAddress, user_id, keyPairBTC, wallet, callback) {
    newAddress.public_key_ETH = wallet.address
    newAddress.public_key_BTC = keyPairBTC.getAddress()
    newAddress.user_id = user_id
    newAddress.balance_BTC = 0
    newAddress.balance_ETH = 0
    newAddress.save(callback)
}
module.exports.getKeyByUserId = function (id, callback) {
    var query = {user_id: id}
    Address.findOne(query, callback);
}
module.exports.udpdateBalanceETH = function (_id, balance) {
    Address.findById({_id: _id}, async function (err, result) {
        if(err) throw new err;
        await Address.findByIdAndUpdate(_id, {balance_ETH: result.balance_ETH+balance})
    })
}
module.exports.udpdateBalanceBTC = function (_id, balance) {
    Address.findById({_id: _id}, async function (err, result) {
        if(err) throw new err;
        await Address.findByIdAndUpdate(_id, {balance_BTC: result.balance_BTC+balance})
    })
}