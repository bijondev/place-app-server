const express = require('express');
const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = "AIzaSyBJsuMgLSrRkGXxEAomeHr8g8fWgaUd8Fo";

const getCoordsForAddress = async (address) => {
    // console.log("getCoordsForAddress address : ", address);
    // let data;
    // try {
    //     const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`);
    //     console.log("getCoordsForAddress response : ", response.data);
    //     data = response.data;
    // }
    // catch (error) {
    //     console.log("getCoordsForAddress : ", error);
    //     throw new HttpError("Could not find location for the address", 422);
    // }


    // if (!data || data.status === 'REQUEST_DENIED') {
    //     throw new HttpError(data.error_message, 422);
    // }

    // if (!data || data.status === 'ZERO_RESULTS') {
    //     throw new HttpError("Could not find location for the address", 422);
    // }

    // const coordinates = data.result[0].geometry.location;

    // return coordinates;

    return {
        lat: 19.6775122,
        lng: -99.0329594
    }
}

module.exports = getCoordsForAddress;