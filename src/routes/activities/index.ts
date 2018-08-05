const activities = require('express').Router();
const get = require('./get');
const post = require('./post');
const activity = require('./activity');
// var passport = require('passport');
// var authorize = require('../../middleware/authorize');
import * as updateRoute from './activity/availability/update';

let update: updateRoute.Route.UpdateActivity = new updateRoute.Route.UpdateActivity();

activities.get('/', get);
activities.post('/', post);
activities.put('/:activityId/availability/:availabilityId', update.update.bind(update.update));
activities.delete('/:activityId', activity);

module.exports = activities;
