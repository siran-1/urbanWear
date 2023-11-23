var express = require('express');
var router = express.Router();
var connection = require('../db/dbConnection');
var AWS = require('aws-sdk');
var multer = require('multer');
var fs = require('fs');

AWS.config.update({
    region: 'us-east-1'
});

var upload = multer({ dest: 'uploads/' })

/* GET inventory. */
router.post('/', function (req, res) {
    const query = "SELECT * FROM urbanWear.inventory;";
    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching inventory data' });
            return;
        }
        res.json(results);
    });
});

router.post('/insert', upload.single('damagedPicture'), async function (req, res) {
    //setting up the bucket   
    var s3 = new AWS.S3();
    var params = {
        Bucket: 'siranurbanwearbucket',
        Key: req.file.originalname,
        Body: fs.createReadStream(req.file.path)
    };
    //s3 file upload
    s3.upload(params, async function (err) {
        if (err) {
            console.log("Error uploading data: ", err);
            res.status(500).send(err);
        } else {
            console.log("Successfully uploaded data to myBucket/myKey");

            //submit the inventory data to the mysql upon successfull s3 submission
            const { productID, stockLevel, supplierID, receivedDate, expiryDate, damagedUnits, productType } = req.body;
            const imageKey = params.Key;
            const values = [productID, stockLevel, supplierID, receivedDate, expiryDate, damagedUnits, productType, imageKey];
            const query = "INSERT INTO urbanWear.inventory(productID,stockLevel,supplierID,receivedDate,expiryDate,damagedUnits,productType,imageKey)VALUES(?,?,?,?,?,?,?,?)";

            const inventoryDatasubmission = await connection.query(query, values);
            res.json(inventoryDatasubmission);
        }
    });
});

router.post('/getinventory', function (req, res) {
    const inventoryID = req.body.inventoryID;
    console.log(inventoryID);
    const query = "SELECT * FROM urbanWear.inventory where inventoryID = ?;";
    connection.query(query, inventoryID, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching inventory data' });
            return;
        }
        let imageKey = results[0].imageKey;
        if (imageKey) {
            var s3 = new AWS.S3();
            var params = {
                Bucket: 'siranurbanwearbucket',
                Key: imageKey,
                Expires: 60
            };
            const url = s3.getSignedUrl('getObject', params);
            results[0].imageData = url;  
            res.json(results);
        } else {
            res.json(results); 
        }
    });
});

module.exports = router;
