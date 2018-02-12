const activities = require('express').Router();
const all = require('./all');

activities.get('/', all);

module.exports = activities;
