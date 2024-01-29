const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //Authorization : 'Bearer TOKEN'
        if (!token) {
            throw new HttpError('Authorization Fail!');
        }

        const decodedToken = jwt.verify(token, 'supersecret_dont_share');
        req.userData = {
            userId: decodedToken.userID
        }
        next();
    }
    catch (error) {
        return next(new HttpError('Authorization Fail!', 401));
    }


}