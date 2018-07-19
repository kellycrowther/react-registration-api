// var connection = require('../../mysql-server-connection');

// post to activities table, return the activity_id, and insert into availability table using activity_id
module.exports = (req: any, res: any) => {

  console.log('request: ', req.body);
  res.status(200);
  res.json({ "Error": false, "Message": "Successful Update" });

  // connection.beginTransaction((err: Error) => {
  //   if (err) {
  //     console.log('Begin Transaction Error: ', err);
  //     res.json({ "Error": true, "Message": "Error executing beginTransaction" });
  //     throw err;
  //   }

  //   let query = "UPDATE activities SET price = '123' WHERE activity_id = '1'";
  //   // var table = [
  //   //   "activities", "activityName", "location", "ageRestriction", "price", "canEdit", "category",
  //   //   req.body.activityName, req.body.location, req.body.ageRestriction, req.body.price, canEdit, req.body.category
  //   // ];
  //   // query = mysql.format(query, table);

  //   // insert into activities table using above parameters
  //   connection.query(query, function (err: Error, result: any) {
  //     if (err) {
  //       connection.rollback(function () {
  //         console.log('Error: ', err);
  //         res.json({ "Error": true, "Message": "Error executing acitvities table query" });
  //         throw err;
  //       });
  //     }
  //     console.log(result.affectedRows + " record(s) updated");
  //     res.status(200).json({ "Error": false, "Message": "Successfully updated record." });

  //   });
  // });
};
