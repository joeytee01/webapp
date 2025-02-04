const mysql = require('mysql2');

// Create a connection to the database
const db = mysql.createConnection({
  host: 'mydb-instance.c1xufzwaz1yr.us-east-1.rds.amazonaws.com', // RDS Endpoint
  user: 'admin', // Your username
  password: 'Ahh0w2001', // Your password
  database: 'mydatabase' // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('error connecting to the database:', err.stack);
    return;
  }
  console.log('connected to the database as id ' + db.threadId);
});

module.exports = db;
