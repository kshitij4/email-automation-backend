"use strict";

const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentsSchema = new Schema({
    listId: {
        type: Schema.Types.ObjectId,
        ref: 'lists'
    },
    name: {
        type: String
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, 
);

module.exports = mongoose.model('students', studentsSchema);