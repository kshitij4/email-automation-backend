"use strict";

const mongoose = require('mongoose');
const { Schema } = mongoose;

const emailRecordsSchema = new Schema({
    listId: {
        type: Schema.Types.ObjectId,
        ref: 'lists'
    },
    sentOn: Date,
    subject: String
},
    {
        timestamps: true
    });

module.exports = mongoose.model('emailRecords', emailRecordsSchema);