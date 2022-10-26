var db = require('./databaseConfig.js');
var categoryDB = {
    //Endpoint 5
    addCategory: function (newCategory, callback) {
        const {category,description} = newCategory; //get request body
        var conn = db.getConnection(); 
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in category.js addCategory`); 
                var sql = 'INSERT INTO category (category,description) VALUES (?, ?)'; 
                conn.query(sql, [category,description], function (err, result) { //parse 2 values into sql query
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null, result.insertId); //return ID of new category
                    }
                });
            }
        });
    },
    //Endpoint 6
    getAllCategories: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in category.js getAllCategories`);
                var sql = `SELECT * FROM category`;
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },
}

module.exports=categoryDB;  //export functions to app.js


