var app = require('../../server');
var connection = require('../../mysql-server-connection');
var mysql = require('mysql');

// this file pulls all information from the availableActivity table

module.exports = (req, res) => {

  console.log('login route hit: ', req.body);
  res.status(200);
  res.json({ "message": "login post route working" });

  // if(req.body.email && req.body.password) {
  //   var email = req.body.email;
  //   var password = req.body.password;
  //   console.log('email: ', email);
  //   console.log('password: ', password);
  // }

  // var user = 

  // simple query to make sure we are retrieving data from mysql
  // connection.query('SELECT * FROM availability JOIN activities ON availability.activity_id = activities.activity_id', function (err, rows, fields) {
  //   if (err) {
  //     console.log('error retrieving the data: ', err.stack);
  //     res.status(404).send(err.stack);
  //     throw err;
  //   }

  //   console.log('availableActivity is: ', rows[1].activityName);

  //   // response to procure for the get request
  //   res.status(200).json(rows);
  //   // res.send(rows);
  // });

  //   res.status(200);
  // res.json({ "message": "login post route working" });
};