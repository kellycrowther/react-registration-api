const users = require('express').Router();
const login = require('./login');

users.post('/login', login);

module.exports = users;
