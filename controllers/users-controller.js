const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    }
    catch (error) {
        console.log("signup : ", error);
        return next(new HttpError("Could not create user, please try again.", 500));
    }

    const createUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    });

    try {
        await createUser.save();
    }
    catch (error) {
        return next(new HttpError(error, 500));
    }

    let token;
    try {
        token = jwt.sign({
            userId: createUser.id,
            email: createUser.email
        },
            'supersecret_dont_share',
            {
                expiresIn: '1h'
            }
        );
    }
    catch (error) {
        return next(new HttpError(error, 500));
    }

    res.status(201).json({
        userId: createUser.id,
        email: createUser.email,
        token: token
    });
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

    if (!existingUser) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    }
    catch (error) {
        return next(new HttpError(
            'Invalid credentials, could not log you in.',
            500
        ));
    }

    if (!isValidPassword) {
        return next(new HttpError(
            'Invalid credentials, could not log you in.',
            500
        ));
    }

    let token;
    try {
        token = jwt.sign({
            userId: existingUser.id,
            email: existingUser.email
        },
            'supersecret_dont_share',
            {
                expiresIn: '1h'
            }
        );
    }
    catch (error) {
        return next(new HttpError(error, 500));
    }


    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    });
};

exports.getUsers = getUsers
exports.signup = signup
exports.login = login