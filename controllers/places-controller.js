const HttpError = require('../models/http-error');
const DUMMY_PLACES = [
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
        // return res
        //     .status(404)
        //     .json({ message: "Could not find a place for the provided Id." });
        const error = new HttpError('Could not find a place for the provided Id.', 404);
        throw error;
    }
    res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
    console.log('GET Request in Places');
    const userId = req.params.uid;
    const place = DUMMY_PLACES.find(p => {
        return p.creator === userId
    });

    if (!place) {
        // return res
        //     .status(404)
        //     .json({ message: "Could not find a place for the provided user Id." });
        const error = new HttpError('Could not find a place for the provided user Id.', 404);
        return next(error);
    }
    res.json({ place });
};

exports.getPlaceById = getPlaceById
exports.getPlaceByUserId = getPlaceByUserId