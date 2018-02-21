var express = require('express');
var app = module.exports = express();
var port = process.env.PORT || 3111;
var router = express.Router();
var routes = require('./routes');

//  Connect all our routes to our application
app.use('/', routes);

// connect to the port
app.listen(port);

console.log('react-registration RESTful API server started on: ' + port);
