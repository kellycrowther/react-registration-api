var users = require('express').Router();
var login = require('./login');
var register = require('./register');
users.post('/login', login);
users.post('/register', register);
module.exports = users;
