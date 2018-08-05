import * as express from 'express';
import * as mysql from 'mysql';
import { IObjectResponse } from '../../../../models/sql';
import { DataTransformationService } from '../../../../services/data-transformation';
var connection = require('../../../../mysql-server-connection');

// put to activities table - update an activity
export module Route {
  export class UpdateActivity {

    public update(req: express.Request, res: express.Response) {
      console.info('Activities->update()', req.body);
      // res.status(200).json({ "Error": false, "Message": "Successful Update" });

      let dataTransformationService = new DataTransformationService();

      let canEdit = dataTransformationService.transformTrueFalse(req.body.canEdit);
      let dateTime = dataTransformationService.createDateTime(req.body.dateTimes.startDate, req.body.dateTimes.time);

      connection.beginTransaction((err: Error) => {
        if (err) {
          console.info('Begin Transaction Update Error: ', err);
          res.status(500).json({ 'Error': true, 'Message': 'Error executing beginTransaction for activity update'});
          throw err;
        }

        let query = "UPDATE activities SET activityName = ?, location = ?, ageRestriction = ?, price = ?, canEdit = ?, category = ? WHERE activity_id = ?";
        let table = [
          req.body.activityName,
          req.body.location,
          req.body.ageRestriction,
          req.body.price,
          canEdit,
          req.body.category,
          req.params.activityId
        ];

        query = mysql.format(query, table);

        // update activities table using above parameters
        connection.query(query, function (err: Error, result: IObjectResponse) {
          if (err) {
            connection.rollback(() => {
              console.info('Error Updating Activity: ', err);
              res.status(500).json({ "Error": true, "Message": "Error executing update acitvities table query" });
              throw err;
            });
          }

          let availability_query = "UPDATE availability SET date_time = ?, quantity = ? WHERE availability_id = ?";
          let availability_table = [
            dateTime,
            req.body.quantity,
            req.params.availabilityId
          ];

          availability_query = mysql.format(availability_query, availability_table);

          connection.query(availability_query, (err: Error, result: IObjectResponse) => {
            if (err) {
              connection.rollback(function () {
                console.info('Update Availability Table Error: ', err);
                res.status(500).json({ "Error": true, "Message": "Error executing update availability table query" });
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
              console.info('Update Activity Transaction Complete.');
              res.status(200).json({ "Error": false, "Message": "Successful Update!" });
            });
          });
        });
      });
    }
  }
}
