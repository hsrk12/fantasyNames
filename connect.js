const sqlite = require('sqlite3').verbose();
let db = new sqlite.Database('activity.db', sqlite.OPEN_READWRITE, (err) => {
    if(err){
        return console.log(err.message);    
    }
    console.log('Connected to the in-memory SQlite database.');
});

const sql = 'CREATE TABLE Activity(ID INTEGER PRIMARY KEY, Sport STRING, GPT_Response)';
db.run(sql)

// db.close((err) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     console.log('Close the database connection.');
//   });
