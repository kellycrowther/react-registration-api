const activities = require('express').Router();
const all = require('./all');
const single = require('./single');
var passport = require('passport');

activities.get('/', all);
activities.post('/', passport.authenticate('jwt', { session: false }), single);

module.exports = activities;
