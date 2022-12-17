"use strict";

const mongoose = require('mongoose');
const { Schema } = mongoose;

const listsSchema = new Schema({
    name: { 
        type: String 
    },
    listNumber: {
        type: Number
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

module.exports = mongoose.model('lists', listsSchema);