let app = new (require('express').Router)();
app.use(require('./login'));
app.use(require('./cabinet'));
module.exports = app;