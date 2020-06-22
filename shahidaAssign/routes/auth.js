const joi = require('joi');
const { User } = require('../models/user')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('config');

router.post('/', async (req, res) => {
    const validation = validate(req.body);
    if (validation.error) {
        return res.status(400).send(validation.error.details[0].message)
    }
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.status(400).send('Invalid username or password')
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
        return res.status(400).send('Invalid username or password')
    }
    // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'))
    const token = user.generateAuthToken();
    if (!token) {
        res.status(400).send("Could not login");
    }
    res.send({ token: token });
})

const validate = (req) => {
    const schema = {
        email: joi.string().min(5).max(255).required().email(),
        password: joi.string().min(5).max(255).required()
    }
    return joi.validate(req, schema);
}

module.exports = router;