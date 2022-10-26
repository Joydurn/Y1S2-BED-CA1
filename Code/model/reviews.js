var db = require('./databaseConfig.js');
var reviewsDB = {
    //Endpoint 10
    addReviews: (productid,details,callback) => {
        const {userid,rating,review} = details;
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                return callback(err,null);
            } else {
                var sql = `SELECT reviewid FROM reviews WHERE userid = ? AND productid = ?`; //extra sql statement to check whether the user had already review the product
                conn.query(sql, [userid,productid], function (err,result) {
                    if (err){
                        return callback(err, null);
                    } else if (result.length > 0) {
                        return callback({reviewed:true}, null)
                    }
                    else {     
                        var insertsql = `INSERT INTO reviews (productid,userid,rating,review) VALUES (?,?,?,?)`;
                        conn.query(insertsql,[productid,userid,rating,review], function (err,result) {
                        if (err){
                            return callback(err, null);
                        } else {     
                            conn.query('SELECT reviewid FROM reviews WHERE userid = ? AND productid = ?',[userid,productid], function (err,result) { //userid and productid combined will be unique since I have validation for that
                                conn.end();
                                if (err){
                                    return callback(err, null);
                                } else {     
                                    return callback(null, result);
                                }
                            });
                        }
                    });
                    }
                });
            }
        })
    },
    /*
    addReview: function (productid,newReview, callback) {
        const {userid,rating,review} = newReview;
        if (rating>5 || rating<1){ //if rating is out of range return error
            err=new Error("Bad Input")
            return callback(err,err);
        }
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in reviews.js addReview`);
                var sql = 
                `INSERT INTO 
                    reviews (productid,userid,rating,review) 
                    VALUES (?, ?, ?, ?)`;
                conn.query(sql, [productid,userid,rating,review], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null, result.insertId); //return ID of new review
                    }
                });
            }
        });
    },
    */
    //Endpoint 11
    getReviews: function (productid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null); //callback is either an error or result, this line results in error
            } else {
                console.log(`Connected to MySQL server in product.js getReviews ID<${productid}>`);
                var sql = `
                    SELECT 
                        p.productid,
                        p.name,
                        u.username,
                        r.rating,
                        r.review,
                        r.created_at
                    FROM 
                        product p,
                        reviews r,
                        users u
                    WHERE 
                        (r.productid = ?)
                        AND
                        (r.productid=p.productid)
                        AND
                        (r.userid=u.userid)`;
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
}

module.exports=reviewsDB;  //export functions to app.js


