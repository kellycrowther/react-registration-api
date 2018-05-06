var app = require('../../server');
var connection = require('../../mysql-server-connection');
var mysql = require('mysql');

module.exports = (req, res) => {
  if(!req.body.account_id || !req.body.activityIds) {
    return res.status(422).json({ "message":  "you are missing account_id or activity_id" });
  }

  var orderTable = createOrderTable(req.body.account_id, req.body.activityIds);
  var order_query = "INSERT INTO orders (account_id, activity_id) VALUES ?";

  connection.query(order_query, [orderTable], function (err, result) {
    if (err) {
      connection.rollback(function () {
        console.log('Order Error: ', err);
        return res.status(500).json({ "Error": true, "Message": "Error executing order table query" });
      });
    }

    return res.status(200).json({"message": "Successful order"});
  });
}

function createOrderTable(account_id, activityIds) {
  let table = [];
  for (let x = 0; x < activityIds.length; x++) {
    let group = [];
    group.push(account_id);
    group.push(activityIds[x]);
    table.push(group);
  }
  return table;
}
