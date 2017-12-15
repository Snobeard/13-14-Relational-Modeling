'use strict';

const mongoose = require('mongoose');
const House = require('./house');
const httpError = require('http-errors');

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  squareFeet: {
    type: Number,
    require: true,
  },
  flooring: {
    type: String,
    require: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),  
  },
  house: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'house',
  }, 
});

module.exports = mongoose.model('room', roomSchema);

roomSchema.pre('save', function(done){

  return House.findById(this.house)
    .then(houseFound => {
      if (!houseFound) {
        throw httpError(404, 'no house listed');
      }
      houseFound.notes.push(this._id);
      return houseFound.save();
    })
    .then(() => {
      done();
    })
    .catch(done);

});

roomSchema.post('remove', (document, done) => {

  return House.findById(document.house)
    .then(houseFound => {
      if (!houseFound) {
        throw httpError(404, 'no house listed');
      }
      houseFound.notes = houseFound.notes.filter((note) => {
        return note._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
    
});