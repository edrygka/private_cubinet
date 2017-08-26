var cluster = require('cluster');
const Logger = require('./loger/index');
const logger = new Logger();

if (cluster.isMaster) {
    require('./bin/master');
}
else {
/*    try {*/
        require('./bin/worker');
/*    }catch (err){
        logger.error(err)
    }*/
}
