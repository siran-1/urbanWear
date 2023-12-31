var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res) {
    req.session.destroy((error) => {
        if (error) {
            console.error("Error destroying session:", error);
            res.status(500).send("Error logging out");
        } else {
            res.send("Logged out successfully");
        }
    });
});

module.exports = router;
