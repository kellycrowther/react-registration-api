const activities = require('express').Router();
const all = require('./all');
const single = require('./single');
var passport = require('passport');
var authorize = require('../../middleware/authorize');
import * as updateRoute from './update';

let update: updateRoute.Route.UpdateActivity = new updateRoute.Route.UpdateActivity();

activities.get('/', all);
activities.post('/', passport.authenticate('jwt', { session: false }), authorize.authorize, single);
activities.put('/', update.update.bind(update.update));

module.exports = activities;