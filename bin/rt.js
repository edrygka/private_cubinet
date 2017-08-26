var Logger = require('../loger/index');
var logger = new Logger();

module.exports = function(req,res,next)
{
    // Засечь начало
    var beginTime = Date.now();
    // В конце ответа
    res.on('finish',()=>{
        var d =  Date.now();
        logger.log('Reponse time: ' + (d - beginTime),{
            url:req.url,
            time:(d - beginTime)
        });
    });
    next();
}