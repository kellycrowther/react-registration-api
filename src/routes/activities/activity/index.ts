const activity = require('express').Router();
import * as deleteRoute from './delete';

let deleteActivity: deleteRoute.Route.DeleteActivity = new deleteRoute.Route.DeleteActivity();

activity.delete('/:activityId', deleteActivity.delete.bind(deleteActivity.delete));

module.exports = activity;
