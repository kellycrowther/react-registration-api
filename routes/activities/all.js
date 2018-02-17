var express = require('express');
var app = express();
var connection = require('../../mysql-server-connection');

// this file pulls all information from the availableActivity table

module.exports = app.get('/', (req, res) => {

    // simple query to make sure we are retrieving data from mysql
    connection.query('SELECT * FROM availableActivity', function (err, rows, fields) {
        if (err) {
            console.log('error retrieving the data: ', err.stack);
            res.status(404).send(err.stack);
            throw err;
        }

        console.log('availableActivity is: ', rows[1].activityName);

        // response to procure for the get request
        res.status(200).json(rows);
        // res.send(rows);
    });
});
