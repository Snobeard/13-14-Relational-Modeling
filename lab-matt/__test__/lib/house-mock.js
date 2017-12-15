'use strict';

const faker = require('faker');
const House = require('../../model/house');

const houseMock = module.exports = {};

let incrementer = 0;

houseMock.create = () => {
  incrementer ++;
  return new House({
    name: `${incrementer}: ${faker.address.streetSuffix()}_${faker.name.jobArea()}`,
    stories: faker.random.number(20),
    climate: faker.random.arrayElement(['Hot', 'Cold', 'Sunny', 'Rainy', 'Desert']),
  }).save();
};

houseMock.many = (number) => {
  return Promise.all(new Array(number).fill(0)
    .map(() => houseMock.create()));
};

houseMock.remove = () => House.remove({});