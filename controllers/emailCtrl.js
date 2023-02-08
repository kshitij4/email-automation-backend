"use strict";

let emailRecords = require('../models/emailRecords');
let lists = require('../models/lists');
let students = require('../models/students');
const fs = require("fs");
const path = require('path');
const { sendMail } = require('./common');


async function getAllLists(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let result = await lists.find({ userId: req.user._id });
        respObj.Data = result;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function addStudentsToList(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "ok",
        Data: null,
    };
    try {

        console.log("file", req.file);
        console.log("filetype", req.file.mimetype);
        let templateBody = req.body.specificTemplateBody;
        let templateSubject = req.body.specificTemplateSubject;
        if (
            req.file.mimetype == "text/x-csv" ||
            req.file.mimetype == "application/vnd.ms-excel" ||
            req.file.mimetype == "text/plain" ||
            req.file.mimetype == "application/octet-stream" ||
            req.file.mimetype == "text/csv"
        ) {
            const fileRows = [];
            let headMatch = [];
            let list = [];
            let notUploadedData = [];
            fs.readFile(req.file.path, "utf8", async function (err, fileData) {
                let x = fileData.split(/\r\n|\n/);
                console.log("x: ", x);
                for (let i = 0; i < x.length - 1; i++) {
                    if (i == 0) {
                        headMatch.push(x[i].split(","));
                    } else list.push(x[i].split(","));
                }
                console.log("list: ", list)

                if (list.length > 0) {
                    let listNo;

                    let listData = await lists.find({}).sort({ listNumber: -1 }).limit(1);
                    console.log("listData :", listData);
                    if (listData.length > 0) {
                        listNo = parseInt(listData[0].listNumber) + 1
                    } else {
                        listNo = 1;
                    }
                    console.log(listNo);
                    let listEntry = await new lists({
                        listNumber: listNo,
                        name: req.params.name,
                        userId: req.user._id
                    }).save();

                    list.map(async (element, i) => {
                        if (element.length === 1) {
                            return;
                        }
                        await new students({
                            userId: req.user._id,
                            listId: listEntry._id,
                            name: element[0],
                            email: element[1],
                            phone: element[2],
                        }).save();
                    });
                }
            });
        } else {
            respObj.IsSuccess = false;
            respObj.Message = "Please upload relevant file(csv)";
            respObj.code = 100;
            return res.json(respObj);
        }
        respObj.IsSuccess = true;
        respObj.Message = "Successfully uploaded csv";
        return res.status(200).json(respObj);
    } catch (err) {
        console.error(err);
        respObj.Message = "Server Error.";
        return res.status(400).json(respObj);
    }
}

async function getAllStudentsByList(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let studentsData = await students.find({ listId: req.params.listId });

        respObj.Data = studentsData;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function getAllStudentsByUser(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let studentsData = await students.find({ userId: req.user._id });

        respObj.Data = studentsData;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function updateListStudents(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        console.log(req.body);
        let studentsData = await students.updateMany({ _id: { $in: req.body.stdIds } },
            { $set: { listId: req.params.listId } });

        respObj.Data = studentsData;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function getAllEmailRecords(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let studentsData = await emailRecords.find({ userId: req.user._id }).populate('listId');

        respObj.Data = studentsData;
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}


async function sendMailToStudents(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK..",
        Data: null,
    };
    try {
        let studentsData = await students.find({ listId: req.params.listId });

        let templateBody = req.body.htmlBody;
        console.log("in send mail ", studentsData)

        studentsData.map(async (std) => {
            console.log("stu: ", std.name)
            var details = {
                name: std.name,
            };
            let replaceName = templateBody.replace(
                /\{(.+?)\}/g,
                (matching, value) => details[value.trim()]
            );
            await sendMail({ name: std.name, email: std.email, body: replaceName, subject: req.body.subject })
        })

        let emailRec = await new emailRecords({ sentOn: new Date(), subject: req.body.subject, listId: req.params.listId, userId: req.user._id }).save();
        respObj.IsSuccess = true;
        return res.status(200).json(respObj);

    } catch (ex) {
        console.error(ex);
        respObj.Message = "Server Error.";
        return res.status(500).json(respObj);
    }
}

async function downloadSampleEmailTemplate(req, res) {
    console.log("sample csv works...");
    const file = await path.join(__dirname, `../sampleCSV/email_sample.csv`);
    res.sendFile(file);
}

module.exports = {
    getAllLists,
    addStudentsToList,
    sendMailToStudents,
    downloadSampleEmailTemplate,
    getAllStudentsByList,
    getAllEmailRecords,
    getAllStudentsByUser,
    updateListStudents
};