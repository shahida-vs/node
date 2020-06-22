const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { User, validate } = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('config');
const auth = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
    if (!req.user.isAdmin) {
        const user = await User.findById(req.user._id).select('-password');
        console.log("user", user);

        res.send(user);
        return;
    }

    const user = await User.find().select('-password');
    console.log("user", user);

    res.send(user);
})

router.post('/', async (req, res) => {

    const validation = validate(req.body)

    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message)
    }
    let user = await User.find({ email: req.body.email })

    if (user.length) {
        return res.status(400).send('User already exists!')
    }
    user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"]))
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email', '_id']))
})

module.exports = router;