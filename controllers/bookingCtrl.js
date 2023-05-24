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
        if (req.user.currBooking) {
            let alreadyBook = await Booking.findById(req.user.currBooking);
            if (alreadyBook && alreadyBook?.status == "pending") {
                respObj.Message = "You already have a booking";
                return res.status(402).json(respObj);
            }
        }

        let truckData = await Truck.findOne({
            _id: req.params.truckId,
            isBooked: false
        })

        if (!truckData || truckData == null) {
            respObj.Message = "Truck not available";
            return res.status(402).json(respObj);
        }

        let TrailerData = await Trailer.findOne({
            _id: req.params.trailerId,
            isBooked: false
        })


        if (!TrailerData || TrailerData == null) {
            respObj.Message = "Trailer not available";
            return res.status(402).json(respObj);
        }

        let booking = await new Booking({
            driverId: req.user._id,
            truckId: req.params.truckId,
            trailerId: req.params.trailerId,
            startTime: new Date(),
            photos: req.body.photos,
            document: req.body.document
        }).save();

        let { truckId, trailerId } = booking;
        if (trailerId) {
            await Trailer.updateOne({ _id: trailerId }, { isBooked: true });
        }
        if (truckId) {
            await Truck.updateOne({ _id: truckId }, { isBooked: true });
        }

        await driver.findByIdAndUpdate(
            req.user._id,
            { $set: { currBooking: booking._id } },
            { new: true }
        )

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

        if (bookData.status == 'delivered') {
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
        let std = await Truck.find({});

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
        let std = await Trailer.find({});

        respObj.Data = std;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function getAllDrivers(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let std = await driver.find({}).populate({
            path: 'currBooking',
            match: { status: 'pending' },
            populate: [
                { path: 'truckId', model: 'Truck' },
                { path: 'trailerId', model: 'Trailer' }
            ]
        }).select('name email phone currBooking');

        respObj.Data = std;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function getDriverDetails(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let std = await driver.findOne({ _id: req.params.driverId }).populate({
            path: 'currBooking',
            match: { status: 'pending' },
            populate: [
                { path: 'truckId', model: 'Truck' },
                { path: 'trailerId', model: 'Trailer' }
            ]
        }).select('name email phone currBooking');

        respObj.Data = std;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function getAllBookings(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let bookingsData = await Booking.find({ driverId: req.params.driverId, status: 'delivered' })
            .populate([
                { path: 'truckId', model: 'Truck' },
                { path: 'trailerId', model: 'Trailer' }
            ]).sort('-startTime');

        respObj.Data = bookingsData;
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
    getAllTrucks,
    getAllDrivers,
    getDriverDetails,
    getAllBookings
};