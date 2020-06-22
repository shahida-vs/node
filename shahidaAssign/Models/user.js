const mongoose = require('mongoose');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
    email: { type: String, required: true, minlength: 5, maxlength: 255, unique: true },
    password: { type: String, required: true, minlength: 5, maxlength: 255 },
    isAdmin: { type: Boolean, required: true }
})
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}
const User = mongoose.model('User', userSchema);
const validateUser = (user) => {
    const schema = {
        name: joi.string().min(5).max(50).required(),
        email: joi.string().min(5).max(255).required().email(),
        password: joi.string().min(5).max(255).required(),
        isAdmin: joi.boolean().required()
    }
    return joi.validate(user, schema)
}

module.exports.User = User;
module.exports.validate = validateUser;