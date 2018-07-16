var connection = require('../mysql-server-connection');
var jwt = require('jsonwebtoken');
var jwtConfig = require('./jwt-strategy.js');
module.exports = {
    // authorize the request if payload role is equal to admin
    authorize: function (req, res, next) {
        var bearer = req.headers.authorization;
        var token = bearer.replace('bearer ', '');
        var payload = jwt.verify(token, jwtConfig.jwtOptions.secretOrKey);
        if (payload) {
            var account_id = payload.account_id;
            var role = payload.role;
        }
        // query to find account in database
        connection.query('SELECT * FROM accounts WHERE account_id = ?', [account_id], function (err, rows, fields) {
            if (err) {
                console.log('Authorize->Error retrieving the data: ', err.stack);
                res.status(404).send(err.stack);
                return err;
            }
            // if no account found
            if (!rows.length) {
                return res.status(401).json({ "message": "No such account found" });
            }
            console.log('Authorize->User: ', rows[0]);
            // check if supplied role matches is an admin
            if (role === 'admin') {
                next();
            }
            else {
                return res.status(401).json({ "message": "You do not have permission to make these changes" });
            }
        });
    }
};
