const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: process.env.DB_DATABASE
});

// connection.query(
//     'SELECT * FROM `users`',
//     function(err, results, fields) {
//       console.log(results); // results contains rows returned by server
//       console.log(fields); // fields contains extra meta data about results, if available
//     }
//   );

connection.connect((error)=> {
    if(error){
        console.log(`The connection error is ${error}`);
        return;
    }
    console.log('Connected to the database!');
});
module.exports = connection