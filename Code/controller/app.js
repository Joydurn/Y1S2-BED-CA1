//use express as middleware for http requests
var express = require('express');
var app = express();

//get functions from model side for each table
var users = require('../model/users.js'); 
var category=require('../model/category.js')
var product=require('../model/product.js')
var reviews=require('../model/reviews.js');
var interest=require('../model/user_interest.js');
var discounts=require('../model/discounts.js');

//allow for url encoding to get parameters from url
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));  //static files for images

//Endpoint 1 add user
app.post('/users/', function (req, res) {
    users.addUser(req.body, function (err, result) {
        if (!err) {
            res.status(201).json({"userid": result});
        }
        else{
            if (err.errno == 1062) { //if duplicate username or email
                res.status(422).send("422 Unprocessable Entity")
            }else{
                res.status(500).send("500 Internal Server Error");
            }
        }
    });
});
//Endpoint 2 get all users
app.get('/users/', function (req, res) {
    users.getAllUsers(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }else{
            res.status(500).send("Internal server error");
        }
    });
});
//Endpoint 3 get user by id
app.get('/users/:userid', function (req, res) {
    const userid = parseInt(req.params.userid); //parse userid parameter from url
    users.getUser(userid, function (err, result) {
        if (!err) {
            if(result.length==0){ //no result= user does not exist
                res.status(404).send("User not found")
            }else{
                res.status(200).send(result);
            }
        }
        else{
            res.status(500).send("500 Internal Server Error");
        }
    });
});
//Endpoint 4 update user
app.put('/users/:userid/', function (req, res) {
    const userid = parseInt(req.params.userid); //parse userid from parameter in url
    users.updateUser(userid, req.body, function (err, result) {
        if (!err) {
            if(!result){//if SELECT query return nothing, user does not exist
                res.status(404).send("User not found");
            }else{
                res.sendStatus(204);
            }
        }else{ 
            if (err.errno == 1062) { //if duplicate username or email
                res.status(422).send("422 Unprocessable Entity")
            }
            else{
                console.log(err)
                res.status(500).send("500 Internal Server Error");
            }
        }
    });
});
//Endpoint 5 add category
app.post('/category', function (req, res) {
    category.addCategory(req.body, function (err, result) {
        if (!err) {
            res.sendStatus(204);
        }
        else{
            if (err.errno == 1062) {//duplicate category name
                res.status(422).send("422 Unprocessable Entity")
            }else{
                res.status(500).send("500 Internal Server Error");
            }
        }
    });
});
//Endpoint 6 get all categories
app.get('/category', function (req, res) {
    category.getAllCategories(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }else{
            res.status(500).send("500 Internal Server Error");
        }
    });
});
//Endpoint 7 add product
app.post('/product/', function (req, res) {
    product.addProduct(req.body, function (err, result) {
        if (!err) {
            res.status(201).json({'productid':result}); 
        }
        else{
            if (err.errno == 1062) { //duplicate product name
                res.status(422).send("422 Unprocessable Entity");
            }else{
                res.status(500).send("500 Internal Server Error");
            }
        }
    });
});
//Endpoint 8 get product by id
app.get('/product/:productid', function (req, res) {
    const productid = parseInt(req.params.productid); //parse productid from parameter from url
    product.getProduct(productid, function (err, result) {
        if (!err) {
            if(result.length==0){ //no result= no product in database
                res.status(404).send("Product not found")
            }else{
                res.status(200).send(result);
            }
        }
        else{
            res.status(500).send("500 Internal Server Error");
        }
    });
});
//Endpoint 8.5 get all products (not in assignment requirements)
app.get('/product/', function (req, res) {
    product.getAllProducts(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }else{
            res.status(500).send("500 Internal Server Error");
        }
    });
});
//Endpoint 9 delete product
app.delete('/product/:productid/', function (req, res) {
    var productid = parseInt(req.params.productid); //get productid from url parameter
    product.deleteProduct(productid, function (err, result) {
        if (!err) {
            if(result[0].length==0){//if SELECT query return nothing, user does not exist
                res.status(404).send("Product not found");
            }else{
                res.sendStatus(204);
            }
        }else{
            res.status(500).send("500 Internal Server Error");
        }
    });
});
//Endpoint 10 add review
app.post('/product/:id/review/', function (req, res) {
    const productid = req.params.id;
    //if empty replace with undefined
    if (req.body.userid == "") req.body.userid = undefined;
    if (req.body.rating == "") req.body.rating = undefined;
    if (req.body.review == "") req.body.review = undefined;
    if (isNaN(req.body.userid) || isNaN(req.body.rating)) {
        res.status(406).json({message:`unacceptable userid or rating submitted`});
    } else {
        reviews.addReviews(productid,req.body,(err, result) => {
            if (err) {
                if (err.errno === 1048) {
                    res.status(411).send({'message':err.sqlMessage.slice(7,)}); //extra validation - sql NN error
                } else if (err.errno === 1452) {
                    res.status(404).send({'message':`product or user does not exist!`}) //extra validation
                } else if (err.reviewed) {
                    res.status(401).send({'message':`sorry but you had already reviewed for this product`}) //extra validation - user cannot review the same product more than once
                } else {
                    res.sendStatus(500); //basic requirement - send status 500 when error unknown
                };
            } else {
                res.status(201).json(result[0]); //basic requirement
            };
        });
    }
});
/*old code
app.post('/product/:productid/review/', function (req, res) {
    var productid = parseInt(req.params.productid); //get productid from url parameter
    reviews.addReview(productid,req.body, function (err, result) {
        if (!err) {
            res.status(201).json({'reviewid':result});
        }
        else if(result==err){ //rating must be between 1 and 5, if invalid input return this error
            res.status(400).send("Invalid rating input, enter between 1 and 5")
        }
        else{
            res.status(500).send("500 Internal Server Error");
        }
    });
});
*/
//Endpoint 11 get reviews for a product
app.get('/product/:productid/reviews', function (req, res) {
    const productid = parseInt(req.params.productid); //get productid from url parameter
    reviews.getReviews(productid, function (err, result) {
        if (!err) {
            if(result.length==0){
                res.status(404).send("Reviews not found")
            }else{
                res.status(200).send(result);
            }
        }
        else{
            res.status(500).send("500 Internal Server Error");
        }
    });
});
//Endpoint 12 add interest for category by userid
app.post('/interest/:userid', function (req, res) {
    const userid = req.params.userid;
    //if empty replace with undefined
    if (isNaN(userid)) {
        res.status(406).json({message:`unacceptable userid submitted`});
    } else if (req.body.categoryids == '' || req.body.categoryids == undefined) {
        res.status(411).json({message:`categoryids is empty`});
    } else {
        interest.addInterests(req.body.categoryids,userid,(err, result) => {
            if (err) {
                console.log(err)
                if (err.errno === 1452) {
                    res.status(404).send({'message':`userid or categoryid does not exist!`}) //extra validation
                } else if (err.empty) {
                    res.status(411).send({'message':`categoryids submitted is empty!`}) //extra validation
                } else if (err.errno === 1054 || err.errno === 1064) {
                    res.status(406).send({'message':'invalid categoryids field/format submitted'}); //extra validation
                } else if (err.existingCategory) {
                    res.status(422).send({'message':'user already interested in the catorgory(s)'}); //extra validation
                } else {
                    res.sendStatus(500); //basic requirement - send status 500 when error unknown
                };
            } else {
                res.sendStatus(201); //basic requirement
            };
        });
    }
});
/*
app.post('/interest/:userid', function (req, res) {
    var userid = parseInt(req.params.userid); //get userid from url parameter
    interest.addInterest(userid,req.body, function (err, result) {
        if (!err) {
            res.sendStatus(201);
        }
        else{
            if (err.errno == 1062) { //interest already created for user
                res.status(422).send("422 Unprocessable Entity");
            }else{
                res.status(500).send("500 Internal Server Error");
            }
        }
    });
}); 
*/
//ADVANCED FEATURES
//DISCOUNTS
//Endpoint 13 Get all discounts information
app.get('/discounts', function (req, res) {
    discounts.getAllDiscounts(function (err, result) {
        if (!err) {
            res.status(200).send(result);
        }else{
            res.status(500).send("500 Internal Server Error");
        }
    });
});
//Endpoint 14 Get discounts for a product
app.get('/discounts/product/:productid', function (req, res) {
    const productid = parseInt(req.params.productid); //get productid from url parameter
    discounts.getDiscountByProduct(productid, function (err, result) {
        if (!err) {
            if(result.length==0){ //no result means that no discounts exist for that product or product doesn't exist
                res.status(404).send("Discounts not found")
            }else{
                res.status(200).send(result);
            }
        }
        else{
            res.status(500).send("500 Internal Server Error");
        }
    });
});
//Endpoint 15 Get discounts by ID
app.get('/discounts/:discountsid', function (req, res) {
    const discountsid = parseInt(req.params.discountsid); //get discountsid from url parameter
    discounts.getDiscountByID(discountsid, function (err, result) {
        if (!err) {
            if(result.length==0){ //no result means discount does not exist
                res.status(404).send("Discount not found")
            }else{
                res.status(200).send(result);
            }
        }
        else{
            res.status(500).send("500 Internal Server Error");
        }
    });
});
//Endpoint 16 Add a discount
app.post('/discounts/:productid/', function (req, res) {
    var productid = parseInt(req.params.productid); //get productid from url parameter
    discounts.addDiscount(productid,req.body, function (err, result) {
        if (!err) {
            res.sendStatus(201);
        }
        else if(err.errno==1452){ //product does not exist
            res.status(404).send("404 Product not found");
        }
        else if(err.errno==1292){ //datetime format invalid
            res.status(400).send("Invalid value given. Ensure starttime and endtime are in 'YYYY-MM-DD Hour:Min:Sec' format")
        }
        else{
            res.status(500).send("500 Internal Server Error")
        }
    });
});
//Endpoint 17 Delete discount
app.delete('/discounts/:discountid/', function (req, res) {
    var discountid = parseInt(req.params.discountid); //get discountid from url parameter
    discounts.deleteDiscount(discountid, function (err, result) {
        if (!err) {
            if(result[0].length==0){//if SELECT query return nothing, discount does not exist
                res.status(404).send("Discount not found");
            }else{
                res.sendStatus(204);
            }
        }else{
            res.status(500).send("500 Internal Server Error");
        }
    });
});

//PRODUCT LISTING IMAGES
//Endpoint 18 Upload product picture
var productid;  //initialise variable names
var newFileName;
const multer=require('multer'); //use multer for file storage
const path=require('path'); //use path to get file extension names
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, '../productimgs/');
    }, //define destination for saving images
    filename: function (req, file, callback) {
        var productid = parseInt(req.params.productid);
        newFileName='product'+productid+path.extname(file.originalname); //get productid from url parameter
        callback(null, newFileName);
  	} //define filename by product ID
  });
var upload = multer({
    storage: storage, 
    limits: {fileSize: 1000000}, //1MB limit
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname); //get extension name 
        if(ext !== '.png' && ext !== '.jpg') {
            return callback(new Error('Only .jpg and .png images allowed'))
        }
        callback(null, true)
    },//file filter to allow only png and jpg images
});

//upload file from user to productimgs folder, if image already exists, it is replaced
app.post('/product/:productid', upload.single('file'), (req, res) => {
    var productid = parseInt(req.params.productid); //get productid from url parameter
    //first check if product exists, then upload image
    product.checkForProduct(productid, function (err, result) {
        if (!err) {
            if(result.length==0){//if SELECT query return nothing, discount does not exist
                res.status(404).send(`File with name '${newFileName}' has been stored in productimgs folder 
                                    WARNING: Product does not exist`); //warn that productid is invalid
            }else{
                if (!req.file) {
                    res.status(400).send('No file received');
                  } else {
                    res.status(201).send(`File with name '${newFileName}' has been stored in productimgs folder`)
                  }
            }
        }else{
            res.status(500).send("500 Internal Server Error");
        }
    });
  });

//Endpoint19 Get product images by productid and file extension
app.get('/product/:productid/:ext',(req, res) => {
    var productid = parseInt(req.params.productid); //get productid from url parameter
    var ext=req.params.ext; //extension name is from url
    var fileName=`product${productid}.${ext}`; 
    var filePath= "../productimgs/";
    product.checkForProduct(productid, function (err, result) {
        if (!err) {
            if(result.length==0){//if SELECT query return nothing, product does not exist
                res.status(404).send(`Product not found`); 
            }else{
                if(ext=='jpg' || ext=='png'){
                res.download(filePath + fileName, (err) => {
                    if (err) {
                      res.status(500).send({
                        message: "File can not be downloaded: " + err,
                      });
                    }
                  });
                }else{
                    res.status(400).send(`Invalid extension name, please state jpg or png in url`)
                }
            }
        }else{
            res.status(500).send("500 Internal Server Error");
        }
    });
});

//export app to server.js
module.exports=app;