var app = require('../../server');
var connection = require('../../mysql-server-connection');
var middleware = require('../../middleware/get-middleware');
var mysql = require('mysql');

// post to activities table, return the activity_id, and insert into availability table using activity_id
module.exports = app.post('/', (req, res) => {

    var canEdit = transformTrueFalse(req.body.canEdit);
    var availabilityData = createAvailability(req.body.availability);

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
        
        // see return statement of createAvailability for mapping of index to values
        var availabilityTable = createAvailabilityTable(activityId, availabilityData[1], availabilityData[0]);
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
  function createAvailability(availability) {
    let dateTimeRange = [];
    var quantityRange = [];
    let mil = 86400000 //24h
    // loop through dateTimes array to get individual object
    for (let x = 0; x < availability.length; x++) {
      // combine the dates and times into one unit of data
      let startDateTime = availability[x].startDate + ' ' + availability[x].time;
      startDateTime = new Date(startDateTime);
      let endDateTime = availability[x].endDate + ' ' + availability[x].time;
      endDateTime = new Date(endDateTime);
      // loop through the date range and put each day into the dateTimeRange array
      // put the quantity into it's own quantity array
      for (let currentDateTime = startDateTime.getTime(); currentDateTime < endDateTime.getTime() + mil; currentDateTime = currentDateTime + mil) {
        dateTimeRange.push(new Date(currentDateTime));
        quantityRange.push(availability[x].quantity);
      }
    }
    // return array of values and access using index in availabilityTable
    return [dateTimeRange, quantityRange];
  }

  function createAvailabilityTable(activityId, quantity, availabilityData, time) {
    var table = [];
    for (var x = 0; x < availabilityData.length; x++) {
      var group = [];
      group.push(activityId);
      group.push(availabilityData[x]);
      group.push(quantity[x]);
      table.push(group);
    }
    return table;
  }

  function transformTrueFalse(canEdit){
    return (canEdit ? 1 : 0);
  }
