const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: 'urbanwearproduction.cmh26ou85r5h.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '!Naruto2023',
    database: '',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database server:', err);
        return;
    }
    console.log('Connected to the database');
});

module.exports = connection;
