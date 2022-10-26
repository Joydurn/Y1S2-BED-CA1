var db = require('./databaseConfig.js');
var productDB = {
    //Endpoint 7
    addProduct: function (newProduct, callback) {
        const {name,description,categoryid,brand,price} = newProduct; //request body
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in product.js addProduct`);
                var sql = 
                `INSERT INTO 
                    product (name,description,categoryid,brand,price) 
                    VALUES (?, ?, ?, ?, ?)`;
                conn.query(sql, [name,description,categoryid,brand,price], function (err, result) { //parse 5 values into sql query
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null, result.insertId); //return ID of new product
                    }
                });
            }
        });
    },
    //Endpoint 8
    getProduct: function (productid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null); //callback is either an error or result, this line results in error
            } else {
                console.log(`Connected to MySQL server in product.js getProduct ID<${productid}>`);
                var sql = `
                    SELECT 
                        p.name,
                        p.description,
                        p.categoryid,
                        c.category,
                        p.brand,
                        p.price
                    FROM 
                        product p,
                        category c
                    WHERE 
                        (p.productid = ?)
                        AND
                        (c.categoryid=p.categoryid)`;
                conn.query(sql, [productid], function (err, result) {  //parse productid into sql query
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
    //Endpoint 8.5
    getAllProducts: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in product.js getAllProducts`);
                var sql = `SELECT * FROM product`;
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
    //Endpoint 9
    deleteProduct: function (productid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in product.js deleteProduct ID<${productid}>`);
                //query twice to determine if product exists
                var sql = `
                    SELECT * FROM product WHERE productid=?;
                    DELETE FROM product WHERE productid = ?`;
                conn.query(sql, [productid,productid], function (err, result) { //parse productid into sql query twice for 2 seperate queries
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
    //Endpoint 18 and 19 check if product exists
    checkForProduct: function (productid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in images.js checkForProduct ID<${productid}>`);
                //select query, if no result then does not exist
                var sql = `
                    SELECT * FROM product WHERE productid=?`;
                conn.query(sql, [productid], function (err, result) {
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

module.exports=productDB;  //export functions to app.js
