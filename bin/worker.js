var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session); // Хранилище сессий в монгодб
var server = require('http').Server(app);
var io = require('socket.io')(server);
require('./dbinit');

//Secure
const Logger = require('../loger/index');
const logger = new Logger();
const config = require('../config/index');
var helmet = require('helmet');
app.use(helmet());
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
const getCurrency = require('../curr_bittrex/currency')


let BTCETH, BTCLTC, BTCZEC, BTCUSDT

//BTCETH = getCurrency('BTC', 'ETH')
function getRatios() {
    return new Promise(async function(res,rej) {
        BTCETH = await getCurrency('BTC', 'ETH')
        BTCLTC = await getCurrency('BTC', 'LTC')
        BTCZEC = await getCurrency('BTC', 'ZEC')
        BTCUSDT = await getCurrency('USDT', 'BTC')
        res();
    })
}


io.on('connection', (socket) => {// SOCKET'S
    (async () => {
        await getRatios();
        socket.emit('currencies', { ETH: BTCETH, LTC: BTCLTC, ZEC: BTCZEC, USD: BTCUSDT });
    })();
    socket.on('response', (data) => {
        //console.log(data)
    })
})

app.disable('x-powered-by')
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

var expiryDate = new Date( Date.now() + 60 * 60 * 1000 );

//Set Static Folder
app.use(express.static(path.join(__dirname, '../public')));
//Сессии экспрес
app.use(session({
    secret: 'neuroseed',
    name: 'session-id',
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
        mongooseConnection: require('mongoose').connection
    }),
    key: 'vodka',
    cookie:{
        //время жизни сессии, выкидывает даже при активности, установил 60 мин
        maxAge: 60 * 60 * 1000
    }
}));


//Passport init
app.use(passport.initialize());
app.use(passport.session());

//Express Validator

app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//Connect Flash
app.use(flash());

//Global Vars
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


app.use(require('./rt'));
app.use(require('./../controllers/index'));

//Set Port
/*app.set('port', (process.env.PORT || 3000));
server.listen(app.get('port'), function(){
    console.log('Server started on port: ' + app.get('port'));
});*/

server.listen(config.port,function(err){
    if(err) throw err;
    logger.log(`Running server at port ${config.port}!`);
});
