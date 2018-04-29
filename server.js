var express = require('express');
var app = module.exports = express();
var port = process.env.PORT || 3111;
var router = express.Router();
var bodyParser = require('body-parser');
var routes = require('./routes');

var passport = require('passport');
var passportJWT = require('passport-jwt');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//  Connect all our routes to our application
app.use('/', routes);

// connect to the port
app.listen(port);

console.log('react-registration RESTful API server started on: ' + port);
