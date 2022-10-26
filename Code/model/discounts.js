var db = require('./databaseConfig.js');
var discountsDB = {
    //Endpoint 13
    getAllDiscounts: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in discounts.js getAllDiscounts`);
                var sql = `SELECT * FROM discounts`;
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
    //Endpoint 14
    getDiscountByProduct: function (productid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null); //callback is either an error or result, this line results in error
            } else {
                console.log(`Connected to MySQL server in discounts.js getDiscountByProduct ID<${productid}>`);
                var sql = `
                    SELECT 
                        discountsid,
                        discountpercent,
                        starttime,
                        endtime
                    FROM 
                        discounts
                    WHERE 
                        productid = ?`;  //don't need to select productid as it is given by user
                conn.query(sql, [productid], function (err, result) { //input product id into sql query
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null); //this callback is error
                    } 
                    else {
                        return callback(null, result); //this callback is success
                    }
                });
            }
        });
    },
    //Endpoint 15
    getDiscountByID: function (discountsid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null); //callback is either an error or result, this line results in error
            } else {
                console.log(`Connected to MySQL server in discounts.js getDiscountByID ID<${discountsid}>`);
                var sql = `
                    SELECT 
                        productid,
                        discountpercent,
                        starttime,
                        endtime
                    FROM 
                        discounts
                    WHERE 
                        discountsid = ?`; //don't need to select discountsid column because it is given by user
                conn.query(sql, [discountsid], function (err, result) { 
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null); //this callback is error
                    } 
                    else {
                        return callback(null, result); //this callback is success
                    }
                });
            }
        });
    },
    //Endpoint 16
    addDiscount: function (productid,newDiscount, callback) {
        const {discountpercent,starttime,endtime} = newDiscount;
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in discounts.js addDiscount ID<${productid}>`);
                //starttime and endtime must be in format 'YYYY-MM-DD HOUR:MIN:SEC' in 24 hour clock
                var sql = 'INSERT INTO discounts (productid,discountpercent,starttime,endtime) VALUES (?,?, ?, ?)';
                conn.query(sql, [productid,discountpercent,starttime,endtime], function (err, result) { //insert 4 values into sql query
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null, result.insertId);
                    }
                });
            }
        });
    },
    //Endpoint 17
    deleteDiscount: function (discountid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in discounts.js deleteDiscount ID<${discountid}>`);
                //query twice to determine if product exists
                var sql = `
                    SELECT * FROM discounts WHERE discountsid=?;
                    DELETE FROM discounts WHERE discountsid = ?`;
                conn.query(sql, [discountid,discountid], function (err, result) { //parse discountid twice for 2 statements
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    }else {
                        return callback(null, result);
                    }
                });
            }
        });
    },
}

module.exports=discountsDB;  //export functions to app.js


