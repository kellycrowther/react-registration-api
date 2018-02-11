var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
var router = express.Router();
var mysql = require('mysql');
var databaseConfig = require('./database-connection-config.json');
var connection = mysql.createConnection(databaseConfig);

// returning data from the root

app.get('/', (req, res) => {
    // connect to the database and catch any errors
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
    });

    // simple query to make sure we are retrieving data from mysql
    connection.query('SELECT * FROM availableActivity', function (err, rows, fields) {
        if (err) throw err;

        console.log('availableActivity is: ', rows[1].activityName);

        // response to procure for the get request
        res.send(rows);
    });

    // close the connection 
    connection.end();
});

app.listen(port);

console.log('react-registration RESTful API server started on: ' + port);
