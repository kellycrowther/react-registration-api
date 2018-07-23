import * as express from 'express';
import * as mysql from 'mysql';
import { IObjectResponse } from '../../models/sql';
import { DataTransformationService } from '../../services/data-transformation';
var connection = require('../../mysql-server-connection');

// put to activities table - update an activity
export module Route {
  export class UpdateActivity {

    public update(req: express.Request, res: express.Response) {
      console.info('Activities->update()', req.body);
      // res.status(200).json({ "Error": false, "Message": "Successful Update" });

      let dataTransformationService = new DataTransformationService();

      let canEdit = dataTransformationService.transformTrueFalse(req.body.canEdit);

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

      // update activities table using above parameters
      connection.query(query, function (err: Error, result: IObjectResponse) {
        if (err) {
          connection.rollback(function () {
            console.log('Error: ', err);
            res.json({ "Error": true, "Message": "Error executing acitvities table query" });
            throw err;
          });
        }
        res.status(200).json({ "Error": false, "Message": "Successfully updated record." });
      });
    }
  }
}
