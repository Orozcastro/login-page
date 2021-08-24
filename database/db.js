const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'mysql-46449-0.cloudclusters.net',
    user: 'admin',
    password: 'Loremafer22',
    database: process.env.DB_DATABASE,
    port: 19835
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