"use strict";

const mongoose = require('mongoose');
const { Schema } = mongoose;

const emailRecordsSchema = new Schema({
    listId: {
        type: Schema.Types.ObjectId,
        ref: 'lists'
    },
    studentIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'students'
        }
    ],
    sentOn: Date,
    subject: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('emailRecords', emailRecordsSchema);