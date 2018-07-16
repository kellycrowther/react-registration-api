var passportJWT = require('passport-jwt');
var connection = require('../mysql-server-connection');
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
// TODO: add expiration to token
// TODO: change secretOrKey to random string
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';
// json web token passport strategy for validating
// the client has access to a route
var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('jwt payload received: ', jwt_payload);
    var account_id = jwt_payload.account_id;
    // check if the account_id, set in payload, matches an account in the database
    connection.query('SELECT * FROM accounts WHERE account_id = ?', [account_id], function (err, rows, fields) {
        if (err) {
            console.log('error retrieving the data: ', err.stack);
            res.status(404).send(err.stack);
            throw err;
        }
        console.log('user: ', rows[0]);
        // check if payload account_id matches database account_id
        if ((rows[0] !== undefined) && (account_id === rows[0].account_id)) {
            // return the users data
            next(null, rows[0]);
        }
        else {
            // return unauthorized if supplied playload account_id does not match database record
            next(null, false);
        }
    });
});
module.exports.strategy = strategy;
module.exports.jwtOptions = jwtOptions;
