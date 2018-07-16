var routes = require('express').Router();
var activities = require('./activities');
var login = require('./users/login');
var register = require('./users/register');
var order = require('./cart/order');
var passport = require('passport');
routes.get('/', function (req, res) {
    res.status(200).json({ message: 'Connected!' });
});
routes.use('/activities', activities);
routes.use('/login', login);
routes.use('/register', register);
routes.use('/order', passport.authenticate('jwt', { session: false }), order);
module.exports = routes;
