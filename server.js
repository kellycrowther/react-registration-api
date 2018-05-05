var express = require('express');
var app = module.exports = express();
var port = process.env.PORT || 3111;
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');
var routes = require('./routes');
var passport = require('passport');
var jwtConfig = require('./middleware/jwt-strategy.js');

passport.use(jwtConfig.strategy);

app.use(passport.initialize());

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// enable cors
// TODO: create config for dev and prod environments
let corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

//  Connect all our routes to our application
app.use('/', routes);

app.get("/secret", passport.authenticate('jwt', {session: false}), function (req, res) {
  res.status(200).json({ message: "Success! You can not see this without a token" });
});

// connect to the port
app.listen(port);

console.log('react-registration RESTful API server started on: ' + port);
