var express = require('express'),
    app = express(),
    port = process.env.PORT || 3111;
var router = express.Router();
var routes = require('./routes');

//  Connect all our routes to our application
app.use('/', routes);

// TODO: error handling for multiple requests; getting:
// error connecting: Error: Cannot enqueue Handshake after invoking quit.
// error: Can't set headers after they are sent (CORS stuff)

app.listen(port);

console.log('react-registration RESTful API server started on: ' + port);
