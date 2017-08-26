var nodemailer = require("../node_modules/nodemailer");
const config = require("../config/index")

module.exports.smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.auth.user,
        pass: config.auth.pass
    }
});