var db = require('./databaseConfig.js');
var interestDB = {
    //Endpoint 12
    addInterests: function(categoryArr,userid,callback) {
        categoryArr = categoryArr.split(',');
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {           
                return callback(err,null);
            } else if (categoryArr.length == 0) {
                return callback({empty:true},null)
            } else {
                //check if duplicate category
                var selectChecksql = `SELECT * FROM interest WHERE userid = ${userid} AND (`;
                for (let i = 0;i < categoryArr.length - 1;i++) {
                    selectChecksql += ` categoryid = ${categoryArr[i]} OR`
                };
                selectChecksql += ` categoryid = ${categoryArr[categoryArr.length - 1]});`;
                conn.query(selectChecksql, function (err,result) {
                    if (err){
                        return callback(err, null);
                    } else if (result.length > 0) {
                        return callback({existingCategory:true},null)
                    } else {
                        var insertsql = `INSERT INTO interest (userid, categoryid) VALUES`;
                        sqlvalue = [];
                        for (let i = 0;i < categoryArr.length - 1;i++) {
                            sqlvalue.push(userid,categoryArr[i]);
                            insertsql += ` (${userid}, ${categoryArr[i]}),`
                        };
                        insertsql += ` (${userid}, ${categoryArr[categoryArr.length - 1]});`
                        conn.query(insertsql,sqlvalue, function (err,result) {
                            conn.end();
                            if (err){
                                return callback(err, null);
                            } else {     
                                return callback(null, result.affectedRows);
                            }
                        });
                    }
                });
            }
        })
    },
    /*
    addInterest: function (userid,categoryids, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in user_interest.js addInterest`);
                var sql = 
                `INSERT INTO 
                user_interest (userid,categoryids) 
                VALUES (?, ?)`;
                conn.query(sql, [userid,categoryids], function (err, result) { //parse 2 values into sql query
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
    }
    */
}

module.exports=interestDB;  //export functions to app.js


