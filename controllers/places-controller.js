// const uuid = require('uuid/v4');
// import { v4 as uuidv4 } from 'uuid';
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

const getCoordsForAddress = require("../util/location");

let DUMMY_PLACES = [
    {
        id: 1,
        title: "Ojo de Agua",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac molestie lorem. Aenean pharetra eget lorem eu porta. Nunc finibus gravida purus, id ultricies nisi tristique quis.",
        address: "PO Box 97145",
        imageUrl: "https://picsum.photos/id/250/700/500",
        location: { lat: 19.6775122, lng: -99.0329594 },
        creator: "u1"
    },
    {
        id: 2,
        title: "Fajões",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac molestie lorem. Aenean pharetra eget lorem eu porta. Nunc finibus gravida purus, id ultricies nisi tristique quis.",
        address: "Room 730",
        imageUrl: "https://picsum.photos/id/251/700/500?random=2",
        location: { lat: 40.9178949, lng: -8.4250467 },
        creator: "u2"
    },
    {
        id: 3,
        title: "Chengxi",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac molestie lorem. Aenean pharetra eget lorem eu porta. Nunc finibus gravida purus, id ultricies nisi tristique quis.",
        address: "Apt 1162",
        imageUrl: "https://picsum.photos/id/252/700/500",
        location: { lat: 36.628305, lng: 101.765843 },
        creator: "u3"
    },
    {
        id: 4,
        title: "Santo Antônio do Monte",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac molestie lorem. Aenean pharetra eget lorem eu porta. Nunc finibus gravida purus, id ultricies nisi tristique quis.",
        address: "Apt 1757",
        imageUrl: "https://picsum.photos/id/253/700/500",
        location: { lat: -20.0859007, lng: -45.2957103 },
        creator: "u2"
    },
    {
        id: 5,
        title: "Panamá",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac molestie lorem. Aenean pharetra eget lorem eu porta. Nunc finibus gravida purus, id ultricies nisi tristique quis.",
        address: "Suite 33",
        imageUrl: "https://picsum.photos/id/254/700/500",
        location: { lat: 8.9823792, lng: -79.5198696 },
        creator: "u2"
    },
    {
        id: 6,
        title: "Lughaye",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac molestie lorem. Aenean pharetra eget lorem eu porta. Nunc finibus gravida purus, id ultricies nisi tristique quis.",
        address: "Apt 1323",
        imageUrl: "https://picsum.photos/id/255/700/500",
        location: { lat: 10.6852616, lng: 43.946063 },
        creator: "u3"
    },
    {
        id: 7,
        title: "Kansas City",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac molestie lorem. Aenean pharetra eget lorem eu porta. Nunc finibus gravida purus, id ultricies nisi tristique quis.",
        address: "Suite 79",
        imageUrl: "https://picsum.photos/id/256/700/500",
        location: { lat: 39.0860093, lng: -94.6321217 },
        creator: "u1"
    },
    {
        id: 8,
        title: "eMbalenhle",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac molestie lorem. Aenean pharetra eget lorem eu porta. Nunc finibus gravida purus, id ultricies nisi tristique quis.",
        address: "16th Floor",
        imageUrl: "https://picsum.photos/id/257/700/500",
        location: { lat: -26.5524312, lng: 29.0750837 },
        creator: "u2"
    },
    {
        id: 9,
        title: "Mashan",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac molestie lorem. Aenean pharetra eget lorem eu porta. Nunc finibus gravida purus, id ultricies nisi tristique quis.",
        address: "Suite 38",
        imageUrl: "https://picsum.photos/id/258/700/500",
        location: { lat: 45.212088, lng: 130.478187 },
        creator: "u3"
    },
    {
        id: 10,
        title: "Cabanaconde",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac molestie lorem. Aenean pharetra eget lorem eu porta. Nunc finibus gravida purus, id ultricies nisi tristique quis.",
        address: "Suite 88",
        imageUrl: "https://picsum.photos/id/269/700/500",
        location: { lat: -15.6225478, lng: -71.9801443 },
        creator: "u1"
    }
];

const getPlaceById = (req, res, next) => {
    console.log('GET Request in Places');
    const placeId = parseInt(req.params.pid);
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId
    });

    if (!place) {

        throw new HttpError('Could not find a place for the provided Id.', 404);
    }
    res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
    console.log('GET Request in Places');
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => {
        return p.creator === userId
    });

    if (!places || places.length === 0) {
        throw error;
        new HttpError('Could not find a places for the provided user Id.', 404);
    }
    res.json({ places });
};

const createPlace = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.log(error);
        return next(new HttpError("invalid inputs passed, please check your data.", 422));
    }
    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createPlace = {
        id: uuid(),
        title,
        description,
        coordinates,
        address,
        creator
    }
    DUMMY_PLACES.push(createPlace);
    res.status(201).json({ place: createPlace });
}

const updatePlace = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.log(error);
        throw new HttpError("invalid inputs passed, please check your data.", 422);
    }
    const { title, description } = req.body;
    const placeId = parseInt(req.params.pid);

    const updatePlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatePlace.title = title;
    updatePlace.description = description;

    DUMMY_PLACES[placeIndex] = updatePlace;

    res.status(200).json({ place: updatePlace });
};
const deletePlace = (req, res, next) => {
    const placeId = parseInt(req.params.pid);

    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HttpError("Could not find a place for that id.", 404);
    }
    DUMMY_PLACES = DUMMY_PLACES.find(p => p.id !== placeId);

    res.status(200).json({ message: "Deleted Place." })
};

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace