const activities = require('express').Router();
const all = require('./all');
const single = require('./single');
const update = require('./update');
var passport = require('passport');
var authorize = require('../../middleware/authorize');

activities.get('/', all);
activities.post('/', passport.authenticate('jwt', { session: false }), authorize.authorize, single);
activities.put('/', update);

module.exports = activities;
