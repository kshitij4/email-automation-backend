"use strict";
const mongoose = require('mongoose');
// const config = require('../config/db');
const Schema = mongoose.Schema;

const User = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }
},
  {
    timestamps: true
  });

module.exports = mongoose.model('user', User);

