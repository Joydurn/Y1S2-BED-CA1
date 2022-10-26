var app = require('./controller/app.js');
var router=require('./controller/app.js');
var port = 8081;
var hostname = "localhost";

var server = app.listen(port, hostname, function () {
    console.log(`Web App Hosted at http://${hostname}:${port}`);
});
