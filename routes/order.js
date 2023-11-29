var express = require('express');
var router = express.Router();
var pool = require('../db/dbConnection'); 
var multer  = require('multer');
var upload = multer();

/* GET order. */
router.post('/', async function (req, res) {
    const query = "SELECT * FROM urbanWear.orders;";
    try {
        const [results] = await pool.query(query); 
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order data' });
    }
});

router.post('/insert', upload.none(), async function (req, res) {
    // Submit the order data to the MySQL
    const { productID, orderDate, orderStatus, orderQuantity } = req.body;
    const values = [productID, orderDate, orderStatus, orderQuantity];
    console.log(values);
    const query = "INSERT INTO urbanWear.orders(productID, orderDate, orderStatus, orderQuantity) VALUES (?, ?, ?, ?)";

    try {
        const [orderDatasubmission] = await pool.query(query, values); 
        res.json(orderDatasubmission);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error submitting order data');
    }
});

module.exports = router;
