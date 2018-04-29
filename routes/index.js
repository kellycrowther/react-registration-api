const routes = require('express').Router();
const activities = require('./activities');
const login = require('./users/login');

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
});

routes.use('/activities', activities);
routes.use('/login', login);

module.exports = routes;
