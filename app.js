const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const HttpError = require('./models/http-error')
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const mongo_url = "mongodb+srv://bijonbairagi:qymMNsfgir4iXQmt@mern-course.ice0zln.mongodb.net/mern_places?retryWrites=true&w=majority";

const app = express();

app.use(bodyParser.json())

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use(cors({ origin: 'http://localhost:3000' }));
// app.use((req, res, next) => {
// res.setHeader('Access-Control-Allow-Origin', '*');
// res.setHeader('Access-Control-Allow-Headers',
//     'Origin, X-Requested-with, Content-Type, Accept, Authorization'
// );
// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
// });

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);



app.use((req, res, next) => {
    throw new HttpError("Could not find this page", 404);
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }

    if (res.headersSent) {
        return next(error);
    }

    res.status(error.code || 500)
        .json({ message: error.message || 'An unknown error occurred' });
});

mongoose.connect(mongo_url)
    .then(() => {
        app.listen(5000);
    })
    .catch(error => {
        console.log(error);
    });

