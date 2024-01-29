const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        console.log("token : ", token);
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ') || req.headers.authorization.split(' ').length !== 2) {
            throw new Error('Authentication failed 102!');
        }
        const decodedToken = jwt.verify(token, 'supersecret_dont_share');
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        console.log("check auth err : ", err);
        let error;
        if (err instanceof jwt.JsonWebTokenError) {
            // Handle JWT errors like token malformed, expired, etc.
            error = new HttpError('Authentication failed due to token error!', 401);
        } else {
            // Handle other errors
            error = new HttpError('Authentication failed 101!', 401);
        }
        return next(error);
    }
};
