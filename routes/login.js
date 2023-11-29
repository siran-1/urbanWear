// routes/login.js
var express = require('express');
var router = express.Router();
const pool = require('../db/dbConnection');
const bcrypt = require('bcrypt');

function queryDatabase(query, values) {
    return pool.query(query, values)
        .then(([results]) => results)
        .catch((error) => { throw error; });
}

/* POST login request */
router.post('/', async function (req, res) {
    const login = req.body.username;
    const password = req.body.password;
   
    try {
        const query = 'SELECT emp_name, department, passhash FROM urbanWear.users WHERE login = ?';
        const values = [login];
        const result = await queryDatabase(query, values);

        if (result.length > 0) {
            const { emp_name: username, department, passhash: hash } = result[0];
            if (bcrypt.compareSync(password, hash)) {
                let role = "";
                if (department === 'operations') {
                    role = 'l4';
                } else if (department === 'warehouse') {
                    role = 'l2';
                }
                req.session.username = username;
                req.session.role = role;
                res.redirect('/login/app');
            } else {
                res.redirect('/?error=invalidcredentials');
            }
        } else {
            res.redirect('/?error=usernotfound');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/?error=servererror');
    }
});

router.get('/app', (req, res) => {
    if (req.session && req.session.username && req.session.role) {
        res.render('index', { title: 'Express', role: req.session.role, username: req.session.username });
    } else {
      res.redirect('/');
    }
});

module.exports = router;
