var mongoose = require('mongoose');
const Logger = require('../loger/index');
const logger = new Logger();
var config = require('../config');
mongoose.Promise = require('bluebird');

mongoose.connect(config.mongoUri,{
    server:{
        poolSize: 10
    }
});

mongoose.connection.on('error',(err)=>
{
    logger.error("Database Connection Error: " + err);
    // Скажите админу пусть включит MongoDB сервер :)
    logger.error('Not starting server MongoDB!');
    process.exit(2);
});

mongoose.connection.on('connected',()=>
{
    logger.info("Succesfully connected to MongoDB Database");
});