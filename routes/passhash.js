const bcrypt = require('bcrypt');

const password = "testuserwilliam8910";

const saltRounds = 10;

bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) {
        console.error(err);
        return;
    }
    bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Hashed Password:", hash);
    });
});
