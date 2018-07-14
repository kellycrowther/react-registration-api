var connection = require('../../mysql-server-connection');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../../middleware/jwt-strategy.js');
var bcrypt = require('bcryptjs');

// this file checks if there is a matching email and password 
// and returns a json web token to client if so

module.exports = (req, res) => {

  // console.log('login: ', req.body);
  // res.status(200).json({ "message": "login post route working" });

  if(req.body.email && req.body.password) {
    var email = req.body.email;
    var candidatePassword = req.body.password;
  }

  // query to find email in database
  connection.query('SELECT * FROM accounts WHERE email = ?', [email], function (err, rows, fields) {
    if (err) {
      console.log('error retrieving the data: ', err.stack);
      res.status(404).send(err.stack);
      return err;
    }

    // if no email found
    if (!rows.length) {
      return res.status(401).json({"message": "no such email found"});
    }

    console.log('user: ', rows[0]);

    // check if candidate password matches database password
    if (bcrypt.compareSync(candidatePassword, rows[0].password)) {
      let role = rows[0].role;
      let payload = {
        account_id: rows[0].account_id,
        role: role
      };
      // sign token and send role in body
      let token = jwt.sign(payload, jwtConfig.jwtOptions.secretOrKey);
      return res.status(200).json({
        "message": "passwords match",
        "role": role,
        "token": token
      });
    } else {
      return res.status(401).json({"message": "passwords do not match"});
    }
  });
};
