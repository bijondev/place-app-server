const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = "AIzaSyBJsuMgLSrRkGXxEAomeHr8g8fWgaUd8Fo";

const getCoordsForAddress = async (address) => {
    // return {
    //     lat: 19.6775122,
    //     lng: -99.0329594
    // }

    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`);

    const data = response.data;

    if (!data || data.status === 'ZERO_RESULTS') {
        throw new HttpError("Could not find location for the address", 422);
    }

    const coordinates = data.result[0].geometry.location;

    return coordinates;
}

module.exports = getCoordsForAddress;