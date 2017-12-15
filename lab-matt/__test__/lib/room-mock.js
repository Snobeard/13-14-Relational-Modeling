'use strict';

const faker = require('faker');
const houseMock = require('./house-mock');
const Room = require('../../model/room');

const roomMock = module.exports = {};

roomMock.create = () => { 
  let mockObject = {};

  return houseMock.create()
    .then(house => {
      mockObject.house = house;

      return new Room({
        name: faker.random.arrayElement(['bedroom', 'bathroom', 'master bedroom', 'garage', 'kitchen', 'dining area', 'living room']),
        squareFeet: faker.random.number({min: 100, max: 1000}),
        flooring: faker.random.arrayElement(['hardwood', 'carpet', 'granite', 'tile', 'heated wood', 'heated tile']),
        house: house._id,
      }).save();

    })
    .then(room => {
      mockObject.room = room;
      return mockObject;
    });
};

roomMock.many = (number) => { 
  let mockObject = {};

  return houseMock.create()
    .then(house => {
      mockObject.house = house;
      
      return Promise.all(new Array(number).fill(0)
        .map(() => {
          return new Room({
            name: faker.random.arrayElement(['bedroom', 'bathroom', 'master bedroom', 'garage', 'kitchen', 'dining area', 'living room']),
            squareFeet: faker.random.number({min: 100, max: 1000}),
            flooring: faker.random.arrayElement(['hardwood', 'carpet', 'granite', 'tile', 'heated wood', 'heated tile']),
            house: house._id,
          }).save();
        }));
    })
    .then(allRooms => {
      mockObject.rooms = allRooms;
      return mockObject;
    });
};

roomMock.remove = () => { 
  return Promise.all([
    Room.remove({}),
    houseMock.remove(),
  ]);
};
