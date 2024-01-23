// const uuid = require('uuid/v4');
// import { v4 as uuidv4 } from 'uuid';
// const { v4: uuid } = require('uuid');
const fs = require('fs');
// const path = require('path');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Place = require('../models/place');
const User = require('../models/user');
const HttpError = require('../models/http-error');

const getCoordsForAddress = require("../util/location");
// const { default: mongoose } = require('mongoose');


const getPlaceById = async (req, res, next) => {

    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    }
    catch (error) {
        return next(new HttpError(error, 500));
    }


    if (!place) {
        return next(new HttpError('Could not find a place for the provided Id.', 404));
    }
    res.json({ place: place.toObject({ getters: true }) });
};




const getPlacesByUserId = async (req, res, next) => {

    const userId = req.params.uid;
    // let places;
    // try {
    //     places = await Place.find({ creator: userId });
    // }
    // catch (error) {
    //     return next(new HttpError(error, 500));
    // }

    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate('places');
    }
    catch (error) {
        return next(new HttpError(error, 500));
    }


    // console.log("userWithPlaces : ", userWithPlaces);
    if (!userWithPlaces || userWithPlaces.length === 0) {

        return next(new HttpError('Could not find a places for the provided user Id.', 404));
    }
    res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
};




const createPlace = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.log(error);
        return next(new HttpError("invalid inputs passed, please check your data.", 422));
    }
    const { title, description, address, creator } = req.body;

    let _user;

    try {
        _user = await User.findById(creator);
    }
    catch (error) {
        console.log("error : ", error);
        return next(new HttpError(error, 500));
    }


    if (!_user) {
        return next(new HttpError("Could not find user for provided Id.", 404));
    }


    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        console.log("coordinates : ", coordinates);
        return next(error);
    }

    const createPlace = new Place({
        title,
        description,
        location: coordinates,
        address,
        imageUrl: req.file.path,
        creator
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await createPlace.save({ session: sess });
        _user.places.push(createPlace);
        await _user.save({ session: sess });

        await sess.commitTransaction();
    }
    catch (error) {
        return next(new HttpError(error, 500));
    }

    res.status(201).json({ place: createPlace });
}





const updatePlace = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.log(error);
        throw new HttpError("invalid inputs passed, please check your data.", 422);
    }
    const { title, description } = req.body;
    const placeId = req.params.pid;


    let place;
    try {
        place = await Place.findById(placeId);
    }
    catch (error) {
        return next(new HttpError(error, 500));
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (error) {
        return next(new HttpError(error, 500));
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};


const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    }
    catch (error) {
        return next(new HttpError(error, 500));
    }

    if (!place) {
        return next(new HttpError("Could not find place for this id.", 404));
    }

    const imagePath = place.imageUrl;

    try {
        if (place) {
            const sess = await mongoose.startSession();
            sess.startTransaction();

            await Place.findByIdAndDelete(placeId, { session: sess });
            place.creator.places.pull(place);

            await place.creator.save({ session: sess });

            await sess.commitTransaction();

        }
        // await place.remove();
    } catch (error) {
        return next(new HttpError(error, 500));
    }
    fs.unlink(imagePath, err => {
        console.log("deletePlace : ", err);
    });
    res.status(200).json({ message: "Deleted Place." })
};

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace