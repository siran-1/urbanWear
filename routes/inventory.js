var express = require('express');
var router = express.Router();
var pool = require('../db/dbConnection');
var AWS = require('aws-sdk');
var multer = require('multer');
var fs = require('fs');

  AWS.config.credentials = new AWS.EC2MetadataCredentials({
  httpOptions: { timeout: 5000 }, 
  maxRetries: 10, 
  retryDelayOptions: { base: 200 } 
});

var upload = multer({ dest: 'uploads/' })

/* GET inventory. */
router.post('/', async function (req, res) {
  const query = "SELECT * FROM urbanWear.inventory;";
  try {
    const [results] = await pool.query(query); 
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching inventory data' });
  }
});

router.post('/insert', upload.single('damagedPicture'), async function (req, res) {
  // Create an S3 client
  var s3 = new AWS.S3({
    region: 'us-east-1',
  });

  var params = {
    Bucket: 'siranurbanwearbucket',
    Key: req.file.originalname,
    Body: fs.createReadStream(req.file.path)
  };
  
  // s3 file upload
  s3.upload(params, async function (err) {
    if (err) {
      console.log("Error uploading data: ", err);
      res.status(500).send(err);
    } else {
      console.log("Successfully uploaded data to myBucket/myKey");

      // Submit the inventory data to the MySQL upon successful S3 submission
      const { productID, stockLevel, supplierID, receivedDate, expiryDate, damagedUnits, productType } = req.body;
      const imageKey = params.Key;
      const values = [productID, stockLevel, supplierID, receivedDate, expiryDate, damagedUnits, productType, imageKey];
      const query = "INSERT INTO urbanWear.inventory(productID,stockLevel,supplierID,receivedDate,expiryDate,damagedUnits,productType,imageKey)VALUES(?,?,?,?,?,?,?,?)";

      const [inventoryDatasubmission] = await pool.query(query, values); 
      res.json(inventoryDatasubmission);
    }
  });
});

router.post('/getinventory', async function (req, res) {
  const inventoryID = req.body.inventoryID;
  console.log(inventoryID);
  const query = "SELECT * FROM urbanWear.inventory where inventoryID = ?;";
  try{
    const [results] = await pool.query(query, [inventoryID]); 
    let imageKey = results[0].imageKey;
    if (imageKey) {
      // Create an S3 client
      var s3 = new AWS.S3({
        region: 'us-east-1',
      });

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
  }catch(error){
    res.status(500).json({ error: 'Error fetching inventory data' });
  }
});

module.exports = router;
