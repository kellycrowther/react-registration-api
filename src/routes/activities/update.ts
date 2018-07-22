import { IObjectResponse } from '../../models/sql';
import * as express from 'express';
import * as mysql from 'mysql';
var connection = require('../../mysql-server-connection');

// put to activities table - update an activity
module.exports = (req: express.Request, res: express.Response) => {
  console.log('REQUEST: ', req.body);
  // res.status(200).json({ "Error": false, "Message": "Successful Update" });

  let canEdit = transformTrueFalse(req.body.canEdit);

  let query = "UPDATE activities SET activityName = ?, location = ?, ageRestriction = ?, price = ?, canEdit = ?, category = ? WHERE activity_id = ?";
  let table = [
    req.body.activityName,
    req.body.location,
    req.body.ageRestriction,
    req.body.price,
    canEdit,
    req.body.category,
    req.body.activity_id
  ];

  query = mysql.format(query, table);

  // insert into activities table using above parameters
  connection.query(query, function (err: Error, result: IObjectResponse) {
    if (err) {
      connection.rollback(function () {
        console.log('Error: ', err);
        res.json({ "Error": true, "Message": "Error executing acitvities table query" });
        throw err;
      });
    }
    console.log(JSON.stringify(result) + " record(s) updated");
    res.status(200).json({ "Error": false, "Message": "Successfully updated record." });
  });
};

function transformTrueFalse(canEdit: boolean) {
  return (canEdit ? 1 : 0);
}
