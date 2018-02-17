var mysql = require('mysql');
var databaseConfig = require('./database-connection-config.json');
var connection = mysql.createConnection(databaseConfig);

// connect to the database and catch any errors
// just connect once
// don't need to close/end the connection
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    res.status(500).send(err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

// export the connection object so we can use it in our routes
module.exports = connection;
