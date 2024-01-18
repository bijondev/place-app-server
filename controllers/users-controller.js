const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: "Bijon Krishna Bairagi",
        email: "bijon@gmail.com",
        password: "123456"
    }
]

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.log(error);
        throw new HttpError("invalid inputs passed, please check your data.", 422);
    }
    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);

    if (hasUser) {
        throw new HttpError("Could not create user, email already exists.", 401);
    }
    const createUser = {
        id: uuid(), name, email, password
    };

    DUMMY_USERS.push(createUser);

    res.status(201).json({ user: createUser });
};

const login = (req, res, next) => {
    const { email, password } = req.body;
    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError("Could not Identify user, credentials seem to be wrong.", 401);
    }

    res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers
exports.signup = signup
exports.login = login