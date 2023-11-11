var express = require('express');
var router = express.Router();
var connection = require('../db/dbConnection');
var multer  = require('multer');
var upload = multer();

/* GET order. */
router.post('/', function (req, res, next) {
    const query = "SELECT * FROM urbanWear.orders;";
    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching order data' });
            return;
        }
        res.json(results);
    });
});

router.post('/insert', upload.none(),async function (req, res, next) {
    //submit the order data to the mysql
    const { productID, orderDate, orderStatus, orderQuantity} = req.body;
    const values = [productID, orderDate, orderStatus, orderQuantity];
    console.log(values);
    const query = "INSERT INTO urbanWear.orders(productID,orderDate,orderStatus,orderQuantity)VALUES(?,?,?,?)";

    const orderDatasubmission = await connection.query(query, values);
    res.json(orderDatasubmission);

});

module.exports = router;
