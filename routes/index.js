const routes = require('express').Router();
const activities = require('./activities');
const login = require('./users/login');
const register = require('./users/register');
const order = require('./cart/order');
var passport = require('passport');


routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
});

routes.use('/activities', activities);
routes.use('/login', login);
routes.use('/register', register);
routes.use('/order', passport.authenticate('jwt', { session: false }), order);

module.exports = routes;
