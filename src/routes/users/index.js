const users = require('express').Router();
const login = require('./login');
const register = require('./register');

users.post('/login', login);
users.post('/register', register);

module.exports = users;
