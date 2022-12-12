const mysql = require('mysql');

const dbConn = mysql.createConnection({
    host: process.env.URL_HOST_DATABASE,
    user: process.env.USER_DATABASE,
    password: process.env.USER_PASSWORD,
    port: process.env.PORT_DATABASE,
    database: process.env.DATABASE_NAME
});

dbConn.connect(err => {
    if (err) console.log(err);
    console.log("Database Connect");
}, 'single');

module.exports = dbConn;