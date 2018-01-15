var express = require('express');
var router = express.Router();
const User = require('../models/user');

router.get('/seed-database', (req, res) => {
    const faker = require('faker');

    for (i = 0; i < 20; i++) {
        var user = new User({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.exampleEmail(),
            birthDate: faker.date.past(),
            status: faker.lorem.sentence(),
            pictureUrl: faker.internet.avatar()
        });
        user.password = user.generateHash('hdm');

        user.save((err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send('database not responding');
            }
        });
    }
    res.send('seeded database');

});

router.get('/purge-database', (req, res) => {
    User.collection.remove((err) => {
        if (err) {
            res.send(err);
        }
        res.send('all good');
    });
});

module.exports = router;
