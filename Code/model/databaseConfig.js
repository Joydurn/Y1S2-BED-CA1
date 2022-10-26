var mysql = require('mysql'); //import sql from npm library
var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "Superman123.", 
            database: "sp_it", 
            dateStrings: true, //parse dates
            multipleStatements: true //allow to do multiple statements in one query
        });     
        return conn;
    }
};
module.exports = dbconnect; //export to other model files
