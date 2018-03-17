var app = require('../../server');
var connection = require('../../mysql-server-connection');
var middleware = require('../../middleware/get-middleware');
var mysql = require('mysql');

// post to availableActivity table
module.exports = app.post('/', (req, res) => {

    // console.log('postman: ', req.body);

    var query = "INSERT INTO ??(??,??, ??, ??, ??, ??) VALUES (?,?,?,?,?,?)";
    var table = [
      "availableActivity", "activityName", "date", "location", "ageRestriction", "price", "canEdit",
      req.body.activityName, req.body.date, req.body.location, req.body.ageRestriction, req.body.price, req.body.canEdit
    ];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
      if (err) {
        console.log('Error: ', err);
        res.json({ "Error": true, "Message": "Error executing MySQL query" });
      } else {
        console.log('Success! Added successfully.');
        res.json({ "Error": false, "Message": "Successful Addition !" });
      }
    })
  });
