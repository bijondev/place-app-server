const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error')
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json())

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    throw new HttpError("Could nod find this page", 404);
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    res.status(error.code || 500)
        .json({ message: error.message || 'An unknown error occurred' });
});

app.listen(5000);