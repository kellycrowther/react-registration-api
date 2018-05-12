var app = require('../../server');
var connection = require('../../mysql-server-connection');
var mysql = require('mysql');

// this file places an order for the customer,
// adding an account_id for each activityIds to orders table
module.exports = (req, res) => {
  // console.log('order body: ', req.body);
  // res.status(200).json({"message": 'success'});

  connection.beginTransaction(function (err) {
    if (err) {
      console.log('Begin Transaction Error: ', err);
      return res.status(500).json({ "Error": true, "Message": "Error executing beginTransaction" });
      throw err;
    }
  
    if (!req.user.account_id || !req.body.activityIds || !req.body.availabilityIds) {
      return res.status(422).json({ "message":  "you are missing account_id or activityIds or availabilityIds" });
    }

    // add order to orders table
    var orderTable = createOrderTable(req.user.account_id, req.body.activityIds, req.body.availabilityIds);
    var order_query = "INSERT INTO orders (account_id, activity_id, availability_id) VALUES ?";

    connection.query(order_query, [orderTable], function (err, result) {
      if (err) {
        connection.rollback(function () {
          console.log('Order Error: ', err);
          return res.status(500).json({ "Error": true, "Message": "Error executing order table query" });
        });
      }

      // update the availability table to have less quantity - parantheses required here
      var availability_query = "UPDATE availability SET quantity = quantity - 1 WHERE availability_id IN (?)";
      connection.query(availability_query, [req.body.availabilityIds], function(err, result) {
        if (err) {
          connection.rollback(function () {
            console.log('Availability Error: ', err);
            return res.status(500).json({ "Error": true, "Message": "Error executing availability table query" });
          });
        }

        connection.commit(function (err) {
          if (err) {
            connection.rollback(function () {
              console.log('Rollback Error: ', err);
              return res.json({ "Error": true, "Message": "Error executing rollback" });
              throw err;
            });
          }
          console.log('Successful order');
          return res.status(200).json({ "message": "Successful order" });
        })
      });
    });
  });
}

// this relys on activityIds and availabilityIds array length
// to be the same and the corresponding arrays match up with one another
function createOrderTable(account_id, activityIds, availabilityIds) {
  let table = [];
  for (let x = 0; x < activityIds.length; x++) {
    let group = [];
    group.push(account_id);
    group.push(activityIds[x]);
    group.push(availabilityIds[x]);
    table.push(group);
  }
  return table;
}
