var express = require('express');
var app = express();
var mysql = require('mysql');
var databaseConfig = require('../../database-connection-config.json');
var connection = mysql.createConnection(databaseConfig);

// this file pulls all information from the availableActivity table

module.exports = app.get('/', (req, res) => {
    // connect to the database and catch any errors
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            res.status(500).send(err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
    });

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

    // close the connection 
    connection.end();
});
