var app = require('../../server');
var connection = require('../../mysql-server-connection');
var middleware = require('../../middleware/get-middleware');
var mysql = require('mysql');

// post to activities table, return the activity_id, and insert into availability table using activity_id
module.exports = app.post('/', (req, res) => {

    var canEdit = transformTrueFalse(req.body.canEdit);
    var availableDateTimes = createAvailableDateTimes(req.body.dateTimes);

    // console.log('request: ', req.body);
    // res.status(200);

    connection.beginTransaction(function (err) {
      if (err) {
        console.log('Begin Transaction Error: ', err);
        res.json({ "Error": true, "Message": "Error executing beginTransaction" });
        throw err; 
      }

      var query = "INSERT INTO ??(??,??, ??, ??, ??, ??) VALUES (?,?,?,?,?,?)";
      var table = [
        "activities", "activityName", "location", "ageRestriction", "price", "canEdit", "category",
        req.body.activityName, req.body.location, req.body.ageRestriction, req.body.price, canEdit, req.body.category
      ];
      query = mysql.format(query, table);

      // insert into activities table using above parameters
      connection.query(query, function (err, result) {
        if (err) {
          connection.rollback(function () {
            console.log('Error: ', err);
            res.json({ "Error": true, "Message": "Error executing acitvities table query" });
            throw err;
          });
        }

        var activityId = result.insertId;
        var quantity = req.body.quantity;
        var time = req.body.dateTimes.time;

        var availabilityTable = createAvailabilityTable(activityId, quantity, availableDateTimes);
        var date_query = "INSERT INTO availability (activity_id, date_time, quantity) VALUES ?";
        
        //insert into availability using above parameters
        // availability table needs to be an array of arrays wrapped in an array e.g.: 
        // [ [ [...], [...], [...] ] ]
        connection.query(date_query, [availabilityTable], function (err, result) {
          if (err) {
            connection.rollback(function () {
              console.log('Availability Table Error: ', err);
              res.json({ "Error": true, "Message": "Error executing availability table query" });
              throw err;
            });
          }
          connection.commit(function (err) {
            if (err) {
              connection.rollback(function () {
                console.log('Rollback Error: ', err);
                res.json({ "Error": true, "Message": "Error executing rollback" });
                throw err;
              });
            }
            console.log('Transaction Complete.');
            res.json({ "Error": false, "Message": "Successful Addition!" });
          });
        });
      });
    });
  });

  // create days in range
  function createAvailableDateTimes(dateTimes) {
    let range = []
    let mil = 86400000 //24h
    // loop through dateTimes array to get individual object
    for (let x = 0; x < dateTimes.length; x++) {
      // combine the dates and times into one unit of data
      let startDateTime = dateTimes[x].startDate + ' ' + dateTimes[x].time;
      startDateTime = new Date(startDateTime);
      let endDateTime = dateTimes[x].endDate + ' ' + dateTimes[x].time;
      endDateTime = new Date(endDateTime);
      // loop through the date range and put each day into the range array
      for (let currentDateTime = startDateTime.getTime(); currentDateTime < endDateTime.getTime(); currentDateTime = currentDateTime + mil) {

        range.push(new Date(currentDateTime))

        //or for timestamp
        //range.push(i)
      }
    }
    console.log('range: ', range);
    return range;
  }

  function createAvailabilityTable(activityId, quantity, availableDates, time) {
    var table = [];
    for(var x = 0; x < availableDates.length; x++) {
      var group = [];
      group.push(activityId);
      group.push(availableDates[x]);
      group.push(quantity);
      table.push(group);
    }
    return table;
  }

  function transformTrueFalse(canEdit){
    return (canEdit ? 1 : 0);
  }
