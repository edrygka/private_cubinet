var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = new (require('express').Router)();
var fs = require('fs');
var Model = require('../models/index')
const Logger = require('../loger/index');
const logger = new Logger();

var rand, mailOptions, host, link, mailUser;
var name;
var email;
var username;
var password;
var password2;
var mailPromise;
var expiryDate = 25000;
app.get('/users/register', function(req, res){
    res.render('register');
});
app.get('/users/login', function(req, res){
    Model.Custom.parseWallets();
    res.render('login');
});
app.post('/users/register', function(req, res){
    //TODO Create hash password

    name = req.body.name;
    email = req.body.email;
    username = req.body.username;
    password = req.body.password;
    password2 = req.body.password2;
    console.log(email)
    //Validation
    var checkBd = new Promise(function(res,rej){
        var data = Model.Custom.uniqueUser(username,email,
            function(data) {
                var resp,
                    regxp = '^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=(.*[a-zA-Z]){4}).{8,20}$',
                    regxp = password.match(regxp);
                if(data.user && data.email) {
                    resp = 'Account with this login name and email already registered.'
                }
                else if(data.user && !data.email) {
                    resp = 'Account with this user name already registered.';
                }
                /*                else if(!data.user && data.email){
                                    resp = 'Account with this email already registered.';
                                }*/
                else if(!data.user && !data.email) {
                    resp = false;
                }
                /*if(regxp) {
                    res(resp);
                }
                else {
                    res('Password must contains 8-20 symbols and contain Uppercase and digits');
                }*/
                console.log(resp)
                res(resp)

            }
        );
    });
    checkBd.then((data) => {
        sendConfirmMail(data);
    })
    function sendConfirmMail(err) {
        console.log('ss')
        var errors = req.validationErrors();
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Password do not match').equals(password);
        errors = (errors) ? errors[0] : null;
        if(!errors) {
            if(err) {
                errors = {};
                errors.msg = err;
            }
        }
        if(errors){//Если есть ошибка, выводим на экран
            errors.status = true;
            res.send(errors.msg);
            return;
        } else {//Если ошибок нет, регистрируем пользователя
            errors = {};
            errors.success = 'Account created.Confirmation mail sent to your email.';
            errors.redirect = req.rawHeaders[9] +'/users/login/';
            logger.log(errors.success);
            res.send(errors);
            // Confirm om mail

            rand=Math.floor((Math.random() * 100) + 54);
            host=req.get('host');
            link="http://"+req.get('host')+"/users/verify?id="+rand;
            mailUser = req.body.email;

            mailOptions={
                from: '<kingspeed07@gmail.com>',
                to : req.body.email,
                subject : "Please confirm your Email account",
                html : ''
            };
            mailPromise = new Promise((resolve,reject) => {
                fs.readFile('../auth/public/email/regmail.html', 'utf-8', (err,data) => {
                    if(err) throw err;
                    data = data;
                    console.log(__dirname);
                    while(data.indexOf('{LINK}') > -1) {
                        data = data.replace('{LINK}' , link);
                    }
                    mailOptions.html = data;
                    if(mailOptions.html == data) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            });
            mailPromise.then(() => {
                Model.Mailer.smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        logger.log(error);
                        res.end("error");
                    }else{
                        console.log("Message sent: " + response.message);
                        res.send('Email with confirm link sent to your email adress.');
                    }
                });
            },() => {
                console.log('error');
            })

        }
    }
});
passport.use(new LocalStrategy(
    function(username, password, done) {
        Model.User.getUserByUsername(username, function(err, user){
            if(err)throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }
            Model.User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else{
                    return done(null, false, {message:'Invalid Password'});
                }
            })
        });
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    Model.User.getUserById(id, function(err, user) {
        done(err, user);
    });
});
app.post('/users/login', function(req,res,next) {
    passport.authenticate('local',function(err,user,info){
        if(!user) {
            console.log('not user');
        };
        if(err) {
            console.log('err');
        };
        req.logIn(user,function(err){
            if(err) res.send(false);
            else {
                res.send(req.rawHeaders[9] +'/users/cabinet/');
            }
        });
    })(req,res,next);
})

app.get('/users/logout', function(req, res){
    req.logout();
    req.session.destroy()
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});
app.get('/users/verify',function(req,res){

    if((req.protocol+"://"+req.get('host'))==("http://"+host)) {
        console.log("Domain is matched. Information is from Authentic email");
        if(req.query.id==rand) {
            logger.log("Email is verified");
            //Model of User
            var newUser = new Model.User({
                name: name,
                email: email,
                username: username,
                password: password,
                address_BTC: 0,
                address_ETH: 0
            });


            //Create a user and his key
            try {
                Model.User.createUser(newUser, function (err, user) {
                    if (err) throw new err
                })
            }catch(err) {
                logger.error(err)
            }

            req.flash('success_msg', 'You are registered and can now login');
            res.redirect('/users/login/success/');

        }
        else {
            logger.log("Email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    }
    else {
        res.end("<h1>Request is from unknown source");
    }
});

module.exports = app;
module.exports.expDate = expiryDate;