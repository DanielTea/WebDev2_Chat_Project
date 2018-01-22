var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Tag = require('../models/tag');
const Chat = require('../models/chat');
const Message = require('../models/message');

router.get('/', (req, res) => {
    res.render('development');
});

router.get('/chats', (req, res) => {
    Chat.find({}, (err, chats) => {
        res.json(chats);
    });
});

router.post('/seed-database', (req, res) => {
    const faker = require('faker');

    var users = [];
    var tags = [];

    for (i = 0; i < 20; i++) {
        try {
            var user = new User({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                password: User.generateHash(process.env.DEV_USER_PASSWORD),
                email: faker.internet.exampleEmail(),
                birthDate: faker.date.past(),
                status: faker.lorem.sentence(),
                pictureUrl: faker.internet.avatar()
            });
            user.save((err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('cannot save new User');
                }
            });
            users.push(user);
        } catch (err) {
            console.log(err);
            return res.status(500).send('cannot create new User');
        }
    }

    for (i = 0; i < 20; i++) {
        var messages = [];
        for (j = 0; j < 20; j++) {
            try {
                var message = new Message({
                    content: faker.lorem.sentence(),
                    user: faker.random.arrayElement(users)
                });
                message.save((err, data) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('cannot save new Message');
                    }
                });
                messages.push(message);
            } catch (err) {
                console.err(err);
                return res.status(500).send('cannot create new Message');
            }
        }
        try {
            var tag = new Tag({
                name: faker.lorem.words(),
                description: faker.lorem.sentence(),
                messages: messages,
                createdBy: faker.random.arrayElement(users)
            });
            tags.push(tag);
            console.log(tags);
            tag.save((err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('cannot save new Tag');
                }
            });
        } catch (err) {
            console.err(err);
            return res.status(500).send('cannot create new Tag');
        }
    }

    for (i = 0; i < 5; i++) {
        users.forEach((user) => {
            var messages = [];
            var chatPartners = [user];
            for (j = 0; j < faker.random.number({ min: 2, max: 5 }); j++) {
                chatPartners.push(faker.random.arrayElement(users));
            }
            for (j = 0; j < faker.random.number({ min: 4, max: 10 }); j++) {
                try {
                    var message = new Message({
                        content: faker.lorem.sentence(),
                        user: faker.random.arrayElement(chatPartners)
                    });
                    message.save((err, data) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send('cannot save new Message');
                        }
                    });
                    messages.push(message);
                } catch (err) {
                    console.err(err);
                    return res.status(500).send('cannot create new Message');
                }
            }
            try {
                var chat = new Chat({
                    name: faker.lorem.words(),
                    users: chatPartners,
                    messages: messages
                });
                chat.save((err, data) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('cannot save new Chat');
                    }
                });
            } catch (err) {
                console.err(err);
                return res.status(500).send('cannot create new Chat');
            }
        });
    }
    users.forEach((user) => {
        for (j = 0; j < faker.random.number({ min: 3, max: 10 }); j++) {
            user.tags.push(faker.random.arrayElement(tags));
        }
        user.save((err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).send('cannot save user');
            }
        });
    });
    res.send('successfully seeded the database');
});

router.post('/purge-database', (req, res) => {
    User.collection.remove((err) => {
        if (err) {
            return res.status(500).send('cannot remove collection "users"');
        }
        Tag.collection.remove((err) => {
            if (err) {
                return res.status(500).send('cannot remove collection "tags"');
            }
            Chat.collection.remove((err) => {
                if (err) {
                    return res.status(500).send('cannot remove collection "chats"');
                }
                Message.collection.remove((err) => {
                    if (err) {
                        return res.status(500).send('cannot remove collection "tags"');
                    }
                    return res.send('successfully removed all collections');
                });
            });
        });
    });
});

module.exports = router;
