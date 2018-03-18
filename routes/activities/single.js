var app = require('../../server');
var connection = require('../../mysql-server-connection');
var middleware = require('../../middleware/get-middleware');
var mysql = require('mysql');

// post to availableActivity table
module.exports = app.post('/', (req, res) => {

    var date = req.body.date;
    var time = req.body.time;

    var dateTime = createDateTime(date, time);
    var canEdit = transformTrueFalse(req.body.canEdit);

    // res.status(200);

    var query = "INSERT INTO ??(??,??, ??, ??, ??, ??) VALUES (?,?,?,?,?,?)";
    var table = [
      "availableActivity", "activityName", "date", "location", "ageRestriction", "price", "canEdit",
      req.body.activityName, dateTime, req.body.location, req.body.ageRestriction, req.body.price, canEdit
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

  function createDateTime(date, time) {
    var year = date.slice(0, 4);
    var month = date.slice(5, 7);
    month = parseInt(month) - 1;

    var day = date.slice(8, 10);

    var hours = time.slice(0, 2);
    var minutes = time.slice(3, 5);

    var dateTime = new Date(year, month, day, hours, minutes);
    return dateTime;
  }

  function transformTrueFalse(canEdit){
    return (canEdit ? 1 : 0);
  }
