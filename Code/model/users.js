var db = require('./databaseConfig.js');
var userDB = {
    //Endpoint 1
    addUser: function (newUser, callback) {
        const {username, email, contact, password, type, profile_pic_url} = newUser; //request body
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in user.js addUser`);
                var sql = 'INSERT INTO users (username, email, contact, password, type, profile_pic_url) VALUES (?, ?, ?, ?, ?, ?)';
                conn.query(sql, [username, email, contact, password, type, profile_pic_url], function (err, result) { //parse 6 values into sql query
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else {
                        return callback(null, result.insertId); //return new user ID
                    }
                });
            }
        });
    },
    //Endpoint 2
    getAllUsers: function (callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in users.js getAllUsers`);
                var sql = `
                SELECT 
                    userid,
                    username, 
                    email, 
                    contact, 
                    type, 
                    profile_pic_url, 
                    created_at 
                FROM users`;
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
    //Endpoint 3
    getUser: function (userid, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null); //callback is either an error or result, this line results in error
            } else {
                console.log(`Connected to MySQL server in users.js getUser ID<${userid}>`);
                var sql = `
                    SELECT 
                        userid,
                        username, 
                        email, 
                        contact, 
                        type, 
                        profile_pic_url, 
                        created_at 
                    FROM users WHERE userid = ?`;
                conn.query(sql, [userid], function (err, result) { //parse userid into sql query
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
    //Endpoint 4
    /*updateUser: function (userid, newUserDetails, callback) {
        const {username, email, contact, password, type, profile_pic_url} = newUserDetails; //request body
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else {
                console.log(`Connected to MySQL server in user.js updateUser ID<${userid}>`);
                var sql = //2 queries, 1st select query, if result is empty then user doesnt exist, 2nd query is to update user
                    `SELECT * FROM users WHERE userid = ?;
                    UPDATE 
                        users
                    SET 
                        username = ?,
                        email = ?, 
                        contact = ?, 
                        password = ?, 
                        type = ?, 
                        profile_pic_url = ? 
                    WHERE 
                        userid = ?
                    `;
                conn.query(sql, [userid, username, email, contact, password, type, profile_pic_url, userid], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err,null);
                    } else{
                        return callback(null, result);
                    }
                });
            }
        });
    },*/
    updateUser: function(userid, newUserDetails, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const findUserByIDQuery = "SELECT * FROM users WHERE userid = ?;";
                dbConn.query(findUserByIDQuery, [userid], (error, existingUser) => {
                    if (error) {
                        return callback(error, null);
                    } else if (existingUser.length == 0) {
                        return callback(null, null);
                    } else {
                        var {username, email, contact, password, type, profile_pic_url} = existingUser[0];
                        if (newUserDetails.username !== undefined) username = newUserDetails.username;
                        if (newUserDetails.email !== undefined) email = newUserDetails.email;
                        if (newUserDetails.contact !== undefined) contact = newUserDetails.contact;
                        if (newUserDetails.password !== undefined) password = newUserDetails.password;
                        if (newUserDetails.type !== undefined) type = newUserDetails.type;
                        if (newUserDetails.profile_pic_url !== undefined) profile_pic_url = newUserDetails.profile_pic_url;
                        const editUserQuery =
                            `
                            UPDATE
                                users
                            SET
                                username = ?,
                                email = ?, 
                                contact = ?, 
                                password = ?, 
                                type = ?, 
                                profile_pic_url = ? 
                            WHERE
                            userid = ?
                            `;
                        dbConn.query(editUserQuery, [username, email, contact, password, type, profile_pic_url,userid], (error, results) => {
                            dbConn.end();
                            if (error) {
                                console.log(err);
                                return callback(error, null);
                            } else {
                                return callback(null, results); 
                            }
                        });
                    }
                });
            }
        });
    },
}
module.exports=userDB; //export functions to app.js