const activities = require('express').Router();
const all = require('./all');
const single = require('./single');
var passport = require('passport');
var authorize = require('../../middleware/authorize');

activities.get('/', all);
activities.post('/', passport.authenticate('jwt', { session: false }), authorize.authorize, single);

module.exports = activities;
