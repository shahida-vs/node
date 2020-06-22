const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {

    const token = req.header('x-auth-header')
    if (!token) {
        return res.status(401).send('Access Denied! No token avaialable')
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(400).send('Invalid Token');
    }
}
module.exports = auth;