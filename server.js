var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
var router = express.Router();
var mysql = require('mysql');
var databaseConfig = require('./database-connection-config.json');
var connection = mysql.createConnection(databaseConfig);

// simple get to test express is working
app.get('/', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

// connect to the database and catch any errors
connection.connect(function (err) {
    if (err) {
        console.error('my error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

// simple query to make sure we are retrieving data from mysql
connection.query('SELECT * FROM availableActivity', function (err, rows, fields) {
    // if (err) throw err

    console.log('availableActivity is: ', rows[1].activityName);
});

// close the connection 
connection.end();


app.listen(port);

console.log('react-registration RESTful API server started on: ' + port);
