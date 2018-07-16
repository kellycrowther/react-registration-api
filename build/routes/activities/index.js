var activities = require('express').Router();
var all = require('./all');
var single = require('./single');
var passport = require('passport');
var authorize = require('../../middleware/authorize');
activities.get('/', all);
activities.post('/', passport.authenticate('jwt', { session: false }), authorize.authorize, single);
module.exports = activities;
