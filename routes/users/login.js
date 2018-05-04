var app = require('../../server');
var connection = require('../../mysql-server-connection');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../../middleware/jwt-strategy.js');

// this file checks if there is a matching email and password 
// and returns a json web token to client if so

module.exports = (req, res) => {

  // console.log('login: ', req.body);
  // res.status(200);
  // res.json({ "message": "login post route working" });

  if(req.body.email && req.body.password) {
    var email = req.body.email;
    var candidatePassword = req.body.password;
  }

  // query to find email in database
  connection.query('SELECT * FROM accounts WHERE email = ?', [email], function (err, rows, fields) {
    if (err) {
      console.log('error retrieving the data: ', err.stack);
      res.status(404).send(err.stack);
      throw err;
    }

    // if no email found
    if (!rows.length) {
      res.status(401).json({"message": "no such email found"});
    }

    console.log('user: ', rows[0]);

    // check if candidate password matches database password
    if (candidatePassword === rows[0].password) {
      let payload = { account_id: rows[0].account_id };
      let token = jwt.sign(payload, jwtConfig.jwtOptions.secretOrKey);
      res.status(200).json({"message": "passwords match", "token": token});
    } else {
      res.status(401).json({"message": "passwords do not match"});
    }
  });
};
