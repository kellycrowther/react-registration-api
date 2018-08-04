import * as express from 'express';
import * as mysql from 'mysql';
import { IObjectResponse } from '../../../models/sql';
var connection = require('../../../mysql-server-connection');

// delete activity
export module Route {
  export class DeleteActivity {

    public delete(req: express.Request, res: express.Response) {
      console.info('Activity->delete()', req.params.activityId);
      // res.status(200).json({ "Error": false, "Message": "Successfully Deleted" });

      connection.beginTransaction((err: Error) => {
        if (err) {
          console.info('Begin Transaction Delete Error: ', err);
          res.status(500).json({ 'Error': true, 'Message': 'EError deleting activity' });
          throw err;
        }

        let activity_query = "DELETE FROM activities WHERE activity_id = ?";
        let table = [
          req.params.activityId
        ];

        activity_query = mysql.format(activity_query, table);

        connection.query(activity_query, function (err: Error, result: IObjectResponse) {
          if (err) {
            connection.rollback(() => {
              console.info('Error Deleting Activity: ', err);
              res.status(500).json({ "Error": true, "Message": "Error deleting activity from activities table" });
              throw err;
            });
          }

          let availability_query = "DELETE FROM availability where activity_id = ?";
          let availability_table = [
            req.params.activityId
          ];

          availability_query = mysql.format(availability_query, availability_table);

          connection.query(availability_query, (err: Error, result: IObjectResponse) => {
            if (err) {
              connection.rollback(function () {
                console.info('Delete Availability Table Error: ', err);
                res.status(500).json({ "Error": true, "Message": "Error deleting activity from availability table query" });
                throw err;
              });
            }
            connection.commit((err: Error) => {
              if (err) {
                connection.rollback(() => {
                  console.info('Rollback Error: ', err);
                  res.status(500).json({ "Error": true, "Message": "Error executing rollback" });
                  throw err;
                });
              }
              console.info('Delete Activity Transaction Complete.');
              res.status(200).json({ "Error": false, "Message": "Successfully Deleted Activity!" });
            });
          });
        });
      });
    }
  }
}
