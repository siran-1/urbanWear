const mysql2 = require('mysql2');

// Create a pool instead of a single connection
const pool = mysql2.createPool({
    host: 'urbanwearproduction.cmh26ou85r5h.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '!Naruto2023',
    database: 'urbanWear', 
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
    connection.release(); 
});

module.exports = pool.promise(); 
