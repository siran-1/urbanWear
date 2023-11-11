var express = require('express');
var router = express.Router();
const connection = require('../db/dbConnection');
const bcrypt = require('bcrypt');

function queryDatabase(query, values) {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

/* GET home page. */
router.post('/', async function (req, res, next) {
    const login = req.body.username;
    const password = req.body.password;
   
    try {
        const query = 'SELECT emp_name, department, passhash from urbanWear.users where login = ?';
        const values = [login];
        const result = await queryDatabase(query, values);

        if (result.length > 0) {
            const { emp_name: username, department, passhash: hash } = result[0];
            console.log(hash);
            if (bcrypt.compareSync(password, hash)) {
                let role = "";
                if (department === 'operations') {
                    role = 'l4';
                } else if (department === 'warehouse') {
                    role = 'l2';
                }
                req.session.username = username;
                req.session.role = role;
                res.redirect('/login/app')
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
    console.log("this is app route"+req.session.username);
    if (req.session && req.session.username && req.session.role) {
        res.render('index', { title: 'Express', role:req.session.role, username:req.session.username});
    }
    else{
      res.redirect('/');
    }
  });

module.exports = router;
