let app = new (require('express').Router)();
var cabinetRouter = new (require('express').Router)();
var fs = require('fs');
var userdata = require('../controllers/index');
var Model = require('../models/index');

app.get('/',(req,res,next)=>{
    res.render('index')
});
app.get('/users/cabinet/',ensureAuth,function(req,res){
    res.render('dashboard' ,{layout: 'cabinet.handlebars'});
});
app.post('/users/cabinet/getexp',ensureAuth,function(req,res) {
    var date = new Date(Date.now() + Model.userdata.expDate);
    res.send(String(+date));
});
app.get('/users/cabinet/dashboard',ensureAuth,function(req,res){
    res.render('dashboard' ,{layout: 'cabinet.handlebars'});
});
app.get('/users/cabinet/payments', ensureAuth , function(req,res) {
    res.render('payments');
})
app.get('/users/cabinet/logout',ensureAuth,function(req,res){
    req.logout();
    res.redirect('/users/login');
});
app.get('/users/login/success/',function(req,res){
    res.render('login',{status : true});
});
function ensureAuth(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        //req.flash('error_msg', 'You are not logged in');
        res.redirect('/users/login');
    }
}
module.exports = app