const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: '18.212.104.18',
    user: 'user',
    password: '12345',
    database: 'SistemaRiego'
});

mysqlConnection.connect(function(err) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Base de datos conectada');
    }
});

module.exports = mysqlConnection;