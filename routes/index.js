const routes = require('express').Router();
const activities = require('./activities');

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
});

routes.use('/activities', activities);

module.exports = routes;
