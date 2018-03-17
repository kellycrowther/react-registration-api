const activities = require('express').Router();
const all = require('./all');
const single = require('./single');

activities.get('/', all);
activities.post('/', single);

module.exports = activities;
