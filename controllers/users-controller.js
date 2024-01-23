const { v4: uuid } = require('uuid');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');


const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    }
    catch (error) {
        return next(new HttpError(error, 500));
    }
    res.json({ users: users.map(u => u.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.log(error);
        throw new HttpError("invalid inputs passed, please check your data.", 422);
    }
    const { name, email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    }
    catch (error) {
        return next(new HttpError(error, 500));
    }

    if (existingUser) {
        return next(new HttpError("User exists already, please login instead.", 422));
    }

    const createUser = new User({
        name,
        email,
        image: req.file.path,
        password,
        places: []
    });

    try {
        await createUser.save();
    }
    catch (error) {
        return next(new HttpError(error, 500));
    }

    res.status(201).json({ user: createUser.toObject({ getter: true }) });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Loggin in failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }

    res.json({
        message: 'Logged in!',
        user: existingUser.toObject({ getters: true })
    });
};

exports.getUsers = getUsers
exports.signup = signup
exports.login = login