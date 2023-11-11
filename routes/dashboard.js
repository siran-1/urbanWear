var express = require('express');
var router = express.Router();
router.use(express.json());

var util = require('util');
var connection = require('../db/dbConnection');
connection.query = util.promisify(connection.query);

/* GET data. */
router.post('/', async function (req, res, next) {
    try {
        let source = req.body.source;
        source == "totalOrders" ? query = 'call urbanWear.GetTotalOrdersForMonth(?,?)' :
            source == "totalStock" ? query = 'call urbanWear.CalculateNewStock(?,?);' :
                source == "supplierMetric" ? query = 'call urbanWear.FetchDamagedUnits(?, ?);' : 
                source == "supplierMetricCompare" ? query = 'call urbanWear.FetchDamagedUnitsCompare(?, ?);': 
                null;
        const selectedMonth = req.body.selectedMonth;
        const selectedYear = req.body.selectedYear;
        const values = [selectedMonth, selectedYear];
        const analyticResults = await connection.query(query, values);
        res.json(analyticResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
