"use strict";

let driver = require('../models/driver');
let admin = require('../models/admin');
let Truck = require('../models/truck');
let Trailer = require('../models/trailer');
let Booking = require('../models/booking');



async function addTruck(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let std = await new Truck({
            number: req.body?.number,
            image: req.body?.image,
            description: req.body?.description
        }).save()

        respObj.Data = std;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function addTrailer(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let std = await new Trailer({
            number: req.body?.number,
            image: req.body?.image,
            description: req.body?.description
        }).save()

        respObj.Data = std;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function bookItem(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let itemData;
        if (req.params.type == "truck") {
            itemData = await Truck.findOne({
                _id: req.params.id,
                isBooked: false
            })
        } else if (req.params.type == "trailer") {
            itemData = await Trailer.findOne({
                _id: req.params.id,
                isBooked: false
            })
        }

        if (!itemData || itemData == null) {
            respObj.Message = "Truck/ Trailer not available";
            return res.status(402).json(respObj);
        }


        let booking = await new Booking({
            driverId: req.user._id,
            [req.params.type + "Id"]: req.params.id,
            startTime: new Date(),
            photos: req.body.photos,
            documents: req.body.documents
        }).save();

        let { truckId, trailerId } = booking;
        if (trailerId) {
            await Trailer.updateOne({ _id: trailerId }, { isBooked: true });
        }
        if (truckId) {
            await Truck.updateOne({ _id: truckId }, { isBooked: true });
        }

        respObj.Data = booking;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}


async function deliverItem(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let bookData = await Booking.findById(req.params.bookingId);

        if(bookData.status == 'delivered'){
            respObj.Message = "Already Delivered";
            return res.status(402).json(respObj);
        }
        let bookingData = await Booking.updateOne({
            _id: req.params.bookingId
        }, [{
            $set: {
                status: 'delivered',
                endTime: new Date(),
                totalMinutes: {
                    $divide: [
                        { $subtract: [new Date(), '$startTime'] },
                        1000 * 60  // Convert milliseconds to hours
                    ]
                }
            }
        }]);

        console.log("bookData: ", bookData);
        let { truckId, trailerId } = bookData;

        if (trailerId) {
            await Trailer.updateOne({ _id: trailerId }, { isBooked: false });
        }
        if (truckId) {
            await Truck.updateOne({ _id: truckId }, { isBooked: false });
        }

        respObj.Data = bookingData;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function getAllTrucks(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let std = await Truck.find({
            isBooked: false
        });

        respObj.Data = std;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function getAllTrailers(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let std = await Trailer.find({
            isBooked: false
        });

        respObj.Data = std;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

module.exports = {
    addTruck,
    addTrailer,
    bookItem,
    deliverItem,
    getAllTrailers,
    getAllTrucks
};