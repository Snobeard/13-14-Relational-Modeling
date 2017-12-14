'use strict';

const mongoose = require('mongoose');

const houseSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  stories: {
    type: Number,
    require: true,
  },
  climate: {
    type: String,
    require: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),  
  }, 
});

module.exports = mongoose.model('house', houseSchema);