var app = require('../../server');
var connection = require('../../mysql-server-connection');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../../middleware/jwt-strategy.js');

// this file adds an account to the database if the email is not already in use

module.exports = (req, res) => {

  // console.log('register: ', req.body);
  // res.status(200).json({ "message": "register post route working" });

  if (req.body.email && req.body.password && req.body.first_name && req.body.last_name && req.body.phone_number && req.body.zip_code) {
    var email = req.body.email;
    var password = req.body.password;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var phone_number = req.body.phone_number;
    var zip_code = req.body.zip_code;
  } else {
    return res.status(422).json({"message": "you are missing a required field"});
  }

  // transaction to find email in database and add user if email not in use
  connection.beginTransaction(function(err) {
    if (err) {
      console.log('Begin Transaction Error: ', err);
      res.json({ "Error": true, "Message": "Error executing beginTransaction" });
      throw err; 
    }

    // query to find email in database
    connection.query('SELECT * FROM accounts WHERE email = ?', [email], function (err, rows, fields) {
      if (err) {
        connection.rollback(function() {
          console.log('error retrieving the data: ', err.stack);
          res.status(404).send(err.stack);
          throw err;
        });
      }

      // if no email found, add it to the database
      if (!rows.length) {

        var query = "INSERT INTO ??(??,??, ??, ??, ??, ??) VALUES (?,?,?,?,?,?)";
        var table = [
          "accounts", "first_name", "last_name", "email", "phone_number", "zip_code", "password",
          req.body.first_name, req.body.last_name, req.body.email, req.body.phone_number, req.body.zip_code, req.body.password
        ];
        query = mysql.format(query, table);

        // add the account
        connection.query(query, function (err, result) {
          console.log('Register Reuslt: ', result);
          if (err) {
            console.log('Error: ', err);
            res.status(500).json({ "Error": true, "message": "Error executing add registration query" });
            throw err;
          }

          var account_id = result.insertId;

          // commit finalizes the transaction
          connection.commit(function (err) {
            if (err) {
              connection.rollback(function () {
                console.log('Rollback Error: ', err);
                res.json({ "Error": true, "Message": "Error executing rollback" });
                throw err;
              });
            }
            let payload = { account_id: account_id };
            let token = jwt.sign(payload, jwtConfig.jwtOptions.secretOrKey);
            console.log('Add account successful');
            return res.status(200).json({ "message": "Successfully added an account", "token": token });
          });
        });
      } else {
        // if email already in use, reject the request
        console.log('Email already in use');
        return res.status(409).json({ "message": "Email already in use" });
      }
    });

  });
};
