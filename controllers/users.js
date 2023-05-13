"use strict";

let user = require('../models/user');
let driver = require('../models/driver');
let admin = require('../models/admin');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        console.log(req.body);
        let isUser = await user.findOne({ email: req.body.email });
        if (isUser) {
            respObj.Message = 'User Already Registered';
            res.status(405).json(respObj);
        } else {
            let newUser = new user(req.body);
            const password = newUser.password;
            newUser.password = await bcrypt.hash(password, 10);
            const result = await newUser.save();

            const token = jwt.sign({ userId: newUser._id }, process.env.SECRET, {
                expiresIn: 604800 // 1 week
            });

            if (result) {
                respObj.IsSuccess = true;
                respObj.Message = 'User Registered Succefully';
                respObj.Data = {
                    token: "Jwt " + token,
                    user: {
                        email: newUser.email,
                        name: newUser.name
                    }
                };
                res.status(200).json(respObj);
            } else {
                respObj.Message = 'Unable to Register User';
                res.status(422).json(respObj);
            }
        }
    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function loginUser(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let password = req.body.password;
        let email = req.body.email;

        let userData = await user.findOne({ email: email });

        if (userData) {
            bcrypt.compare(password, userData.password, async (err, isMatch) => {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    const token = jwt.sign({ userId: userData._id }, process.env.SECRET, {
                        expiresIn: 604800 // 1 week
                    });
                    respObj.IsSuccess = true;
                    respObj.Message = 'Logged In Succefully';
                    respObj.Data = {
                        token: "Jwt " + token,
                        user: {
                            id: userData._id,
                            email: userData.email,
                            name: userData.name
                        }
                    };
                    res.status(200).json(respObj);
                } else {
                    respObj.Message = 'Email or Password Incorrect';
                    return res.status(401).json(respObj);
                }
            });

        } else {
            respObj.Message = 'Email or Password Incorrect';
            return res.status(401).json(respObj);
        }
    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function registerAdmin(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        console.log(req.body);
        let isAdmin = await admin.findOne({ email: req.body.email });
        if (isAdmin) {
            respObj.Message = 'Admin Already Registered';
            res.status(405).json(respObj);
        } else {
            let newAdmin = new admin(req.body);
            const password = newAdmin.password;
            newAdmin.password = await bcrypt.hash(password, 10);
            const result = await newAdmin.save();

            const token = jwt.sign({ id: newAdmin._id }, process.env.SECRET, {
                expiresIn: 604800 // 1 week
            });

            if (result) {
                respObj.IsSuccess = true;
                respObj.Message = 'Admin Registered Succefully';
                respObj.Data = {
                    token: "admin " + token,
                    admin: {
                        email: newAdmin.email,
                        name: newAdmin.name
                    }
                };
                res.status(200).json(respObj);
            } else {
                respObj.Message = 'Unable to Register Admin';
                res.status(422).json(respObj);
            }
        }
    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function loginAdmin(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let password = req.body.password;
        let email = req.body.email;

        let adminData = await admin.findOne({ email: email });

        if (adminData) {
            bcrypt.compare(password, adminData.password, async (err, isMatch) => {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    const token = jwt.sign({ id: adminData._id }, process.env.SECRET, {
                        expiresIn: 604800 // 1 week
                    });
                    respObj.IsSuccess = true;
                    respObj.Message = 'Logged In Succefully';
                    respObj.Data = {
                        token: "admin " + token,
                        admin: {
                            id: adminData._id,
                            email: adminData.email,
                            name: adminData.name
                        }
                    };
                    res.status(200).json(respObj);
                } else {
                    respObj.Message = 'Email or Password Incorrect';
                    return res.status(401).json(respObj);
                }
            });

        } else {
            respObj.Message = 'Email or Password Incorrect';
            return res.status(401).json(respObj);
        }
    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function registerDriver(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        console.log(req.body);
        let isDriver = await driver.findOne({ email: req.body.email });
        if (isDriver) {
            respObj.Message = 'Driver Already Registered';
            res.status(405).json(respObj);
        } else {
            let newDriver = new driver(req.body);
            const password = newDriver.password;
            newDriver.password = await bcrypt.hash(password, 10);
            const result = await newDriver.save();

            const token = jwt.sign({ id: newDriver._id }, process.env.SECRET, {
                expiresIn: 604800 // 1 week
            });

            if (result) {
                respObj.IsSuccess = true;
                respObj.Message = 'Driver Registered Succefully';
                respObj.Data = {
                    token: "driver " + token,
                    driver: {
                        email: newDriver.email,
                        name: newDriver.name
                    }
                };
                res.status(200).json(respObj);
            } else {
                respObj.Message = 'Unable to Register Driver';
                res.status(422).json(respObj);
            }
        }
    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function loginDriver(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let password = req.body.password;
        let email = req.body.email;

        let driverData = await driver.findOne({ email: email });

        if (driverData) {
            bcrypt.compare(password, driverData.password, async (err, isMatch) => {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    const token = jwt.sign({ id: driverData._id }, process.env.SECRET, {
                        expiresIn: 604800 // 1 week
                    });
                    respObj.IsSuccess = true;
                    respObj.Message = 'Logged In Succefully';
                    respObj.Data = {
                        token: "driver " + token,
                        driver: {
                            id: driverData._id,
                            email: driverData.email,
                            name: driverData.name
                        }
                    };
                    res.status(200).json(respObj);
                } else {
                    respObj.Message = 'Email or Password Incorrect';
                    return res.status(401).json(respObj);
                }
            });

        } else {
            respObj.Message = 'Email or Password Incorrect';
            return res.status(401).json(respObj);
        }
    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

module.exports = {
    registerUser,
    loginUser,
    registerAdmin,
    loginAdmin,
    registerDriver,
    loginDriver
};