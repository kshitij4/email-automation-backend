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

async function bookTruck(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let alreadyBook;
        if (req.user.currBooking) {
            alreadyBook = await Booking.findById(req.user.currBooking);
        }

        if (alreadyBook && alreadyBook.status == 'pending') {
            respObj.Message = "You already have a truck booked";
            return res.status(402).json(respObj);
        }

        let truckData = await Truck.findOne({
            _id: req.params.truckId,
            isBooked: false
        })

        if (!truckData || truckData == null) {
            respObj.Message = "Truck not available";
            return res.status(402).json(respObj);
        }

        let booking = await new Booking({
            driverId: req.user._id,
            truck: {
                truckId: req.params.truckId,
                photos: req.body.photos,
                document: req.body.document
            },
            startTime: new Date(),

        }).save();

        await Truck.updateOne({ _id: req.params.truckId }, { isBooked: true });


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

async function bookTrailer(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        if (!req.user.currBooking) {
            respObj.Message = "Book a Truck first";
            return res.status(402).json(respObj);
        }

        let alreadyBook = await Booking.findById(req.user.currBooking);
        if (!alreadyBook) {
            respObj.Message = "Your Booking doesn't exist";
            return res.status(402).json(respObj);
        }

        if (!alreadyBook.trailer?.trailerId) {
            let TrailerData = await Trailer.findOne({
                _id: req.params.trailerId,
                isBooked: false
            })


            if (!TrailerData || TrailerData == null) {
                respObj.Message = "Trailer not available";
                return res.status(402).json(respObj);
            }

            alreadyBook.trailer = {
                trailerId: req.params.trailerId,
                photos: req.body.photos,
                document: req.body.document
            }

        } else {
            if (alreadyBook.trailer.status == 'pending') {
                respObj.Message = "Deliver previous truck before booking a new one";
                return res.status(402).json(respObj);
            }
            if (alreadyBook.returnTrailer?.trailerId) {
                respObj.Message = "Already Booked max Trailers";
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

            alreadyBook.returnTrailer = {
                trailerId: req.params.trailerId,
                photos: req.body.photos,
                document: req.body.document
            }
        }

        let bookingUpdated = await alreadyBook.save();
        await Trailer.updateOne({ _id: req.params.trailerId }, { isBooked: true });

        respObj.Data = bookingUpdated;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function deliverTruck(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        if (!req.user.currBooking) {
            respObj.Message = "There is no Booking";
            return res.status(402).json(respObj);
        }
        console.log(req.user.currBooking);
        let bookData = await Booking.findById(req.user.currBooking);

        if (bookData.status == 'completed') {
            respObj.Message = "Already Delivered";
            return res.status(402).json(respObj);
        }

        if (bookData.truck?.truckId && bookData.trailer?.trailerId && bookData.returnTrailer?.trailerId &&
            bookData.truck?.status == "pending" && bookData.trailer?.status == "delivered" && bookData.returnTrailer?.status == "delivered") {

            let startTime = bookData.startTime;
            const diffMiliSec = Math.abs(new Date() - new Date(startTime));
            const diffMSec = Math.floor(diffMiliSec / 1000);

            bookData.truck.status = 'delivered';
            bookData.endTime = new Date();
            bookData.totalSeconds =  diffMSec;
            bookData.status = 'completed';

            await bookData.save();

            await Truck.updateOne({ _id: bookData.truck.truckId }, { isBooked: false });
        } else {
            respObj.Message = "Cant Complete jouney yet"
            return res.status(402).json(respObj);
        }

        respObj.Message = "Journey Completed"
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function deliverTrailer(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        if (!req.user.currBooking) {
            respObj.Message = "There is no Booking";
            return res.status(402).json(respObj);
        }
        let bookData = await Booking.findById(req.user.currBooking);

        if (bookData.status == 'completed') {
            respObj.Message = "Already Delivered";
            return res.status(402).json(respObj);
        }

        if (!bookData.truck) {
            respObj.Message = "Truck not found"
            return res.status(402).json(respObj);
        }

        if (req.body.trailerType == '2' && bookData.trailer && bookData.trailer.trailerId == req.params.trailerId) {
            bookData.trailer.status = 'delivered';
        } else if (req.body.trailerType == '3' && bookData.returnTrailer && bookData.returnTrailer.trailerId == req.params.trailerId) {
            bookData.returnTrailer.status = 'delivered';
        } else {
            respObj.Message = "Trailer not found";
            return res.status(402).json(respObj);
        }

        await bookData.save();

        await Trailer.updateOne({ _id: req.params.trailerId }, { isBooked: false });


        respObj.Message = "Trailer Delivered"
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

async function getCurrBookingData(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        if (!req.user.currBooking) {
            respObj.Message = "There is no Booking";
            return res.status(402).json(respObj);
        }
        let bookingsData = await Booking.findById(req.user.currBooking);

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
    getAllBookings,
    deliverTrailer,
    deliverTruck,
    bookTrailer,
    bookTruck,
    getCurrBookingData
};