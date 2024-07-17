// db.js
const mysql = require('mysql');
const config = require('./config');

// Create MySQL connection
const connection = mysql.createConnection(config.db);

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

// Export connection for use in other modules
module.exports = connection;

