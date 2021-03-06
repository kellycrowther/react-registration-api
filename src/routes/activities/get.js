var app = require('../../server');
var connection = require('../../mysql-server-connection');
var middleware = require('../../middleware/get-middleware');

// this file pulls all information from the availableActivity table

module.exports = (req, res) => {

    // simple query to make sure we are retrieving data from mysql
    connection.query('SELECT * FROM availability JOIN activities ON availability.activity_id = activities.activity_id', function (err, rows, fields) {
        if (err) {
            console.log('error retrieving the data: ', err.stack);
            res.status(404).send(err.stack);
            throw err;
        }

        console.log('availableActivity is: ', rows[1].activityName);

        transformTrueFalse(rows);

        transformDateToHumanReadable(rows);

        // response to procure for the get request
        res.status(200).json(rows);
        // res.send(rows);
    });
};

// transform from 0/1 to false/true respectively
function transformTrueFalse(data) {
    for (let x = 0; x < data.length; x++) {
        if (data[x].canEdit === 0) {
            data[x].canEdit = false;
        } else {
            data[x].canEdit = true;
        };
    };
}

function transformDateToHumanReadable(data) {
    for (let x = 0; x < data.length; x++) {
        if (data[x].date_time) {
            var readableDate = new Date(data[x].date_time);
            data[x].date = readableDate.toLocaleDateString();
            data[x].time = readableDate.toLocaleTimeString();
        }
    };
}
