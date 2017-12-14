'use strict';

// require('dotenv').config();
// require('./lib/server').start();

const faker = require('faker');

console.log(faker.address.streetSuffix() + '_' + faker.name.jobArea());
console.log(faker.random.number(20));
console.log(faker.random.arrayElement(['Hot', 'Cold', 'Sunny', 'Rainy', 'Desert']));

