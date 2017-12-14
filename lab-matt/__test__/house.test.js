'use strict';

let PORT = process.env.PORT | 3000;

const faker = require('faker');
const superagent = require('superagent');
const House = require('../model/house');
const server = require('../lib/server');
let incrementer = 0;

const apiURL = `http://localhost:${PORT}/api/house`;

const houseCreate = () => {
  incrementer ++;

  return new House({
    name: `${incrementer}: ${faker.address.streetSuffix()}_${faker.name.jobArea()}`,
    stories: faker.random.number(20),
    climate: faker.random.arrayElement(['Hot', 'Cold', 'Sunny', 'Rainy', 'Desert']),
  }).save();
};

const houseMany = (amount) => {
  return Promise.all(new Array(amount)
    .fill(0)
    .map(() => houseCreate()));
};

describe('/api/house', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => House.remove({}));

  // ===================== POST =====================
  describe('POST /api/house', () => {
    test('POST should respond with 200 and data if no error', () => {
      let housePost = {
        name: `${faker.address.streetSuffix()}_${faker.name.jobArea()}`,
        stories: faker.random.number(20),
        climate: faker.random.arrayElement(['Hot', 'Cold', 'Sunny', 'Rainy', 'Desert']),
      };

      return superagent.post(`${apiURL}`)
        .send(housePost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();
          
          expect(response.body.name).toEqual(housePost.name);
          expect(response.body.stories).toEqual(housePost.stories);
          expect(response.body.climate).toEqual(housePost.climate);
        });
    });
    
    test('POST should respond with 400 status code if there is an incomplete object', () => {
      let house = {stories: 10};
      
      return superagent.post(`${apiURL}`)
        .send(house)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(400);
        });
    });
  });

  // ===================== GET =====================
  describe('GET /api/house', () => {
    test('GET should respond with 404 if no houses are listed', () => {
      return superagent.get(`${apiURL}`)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });

    test('GET should respond with 200 and array of houses, up to 10', () => {
      return houseMany(100)
        .then(() => {
          return superagent.get(`${apiURL}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body).toBeInstanceOf(Array);
        });
    });

  });

  describe('GET /api/house/:id', () => {
    test('GET should respond with 200 and data if no error', () => {
      let houseToTest = null;

      return houseCreate()
        .then(house => {
          houseToTest = house;
          return superagent.get(`${apiURL}/${house._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(houseToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();
          
          expect(response.body.name).toEqual(houseToTest.name);
          expect(response.body.stories).toEqual(houseToTest.stories);
          expect(response.body.climate).toEqual(houseToTest.climate);
        });
    });

    test('GET should respond with 404 if id is not found', () => {
      return superagent.get(`${apiURL}/moosejaw`)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });
  });

  // ===================== PUT =====================
  describe('PUT /api/house/:id', () => {
    test('PUT should respond with 200 and data if no error and data should be updated', () => {
      let housePut = null;

      return houseCreate()
        .then(house => {
          housePut = house;
          return superagent.put(`${apiURL}/${house._id}`)
            .send({name: 'BIG MANSION'});
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body.name).toEqual('BIG MANSION');
          expect(response.body.legs).toEqual(housePut.legs);
          expect(response.body._id).toEqual(housePut._id.toString());
          expect(response.body.timestamp).not.toBeNull();
        });
    });

    test('PUT should respond with 404 if id is not found', () => {
      return superagent.put(`${apiURL}/moosejaw`)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });
  });

  // ===================== DELETE =====================
  describe('DELETE /api/house/:id', () => {
    test('DELETE should respond with 204 and data if no error', () => {

      return houseCreate()
        .then(house => {
          return superagent.delete(`${apiURL}/${house._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });

    test('DELETE should respond with 404 if id is not found', () => {
      return superagent.delete(`${apiURL}/moosejaw`)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });
  });
});