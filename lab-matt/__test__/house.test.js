'use strict';

require('./lib/setup');

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const houseMock = require('./lib/house-mock');

const PORT = process.env.PORT;

const __API_URL__ = `http://localhost:${PORT}/api/house`;

describe('/api/house', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(houseMock.remove);

  // ===================== POST =====================
  describe('POST /api/house', () => {
    test('POST should respond with 200 and data if no error', () => {
      let houseToPost = {
        name: `myHouse`,
        stories: faker.random.number(20),
        climate: faker.random.arrayElement(['Hot', 'Cold', 'Sunny', 'Rainy', 'Desert']),
      };
     
      return superagent.post(__API_URL__)
        .send(houseToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();
          
          expect(response.body.name).toEqual(houseToPost.name);
          expect(response.body.stories).toEqual(houseToPost.stories);
          expect(response.body.climate).toEqual(houseToPost.climate);
        });
    });
    
    test('POST should respond with 409 if there is a duplicate name', () => {
      return houseMock.create()
        .then(house => {
          return superagent.post(__API_URL__)
            .send({
              name: house.name,
              stories: house.stories,
              climate: house.climate,
            });
        })
        .then(response => {
          expect(response).toEqual('nothing because this will not show');
        })
        .catch(error => {
          expect(error.status).toEqual(409);
        });
    });

    test('POST should respond with 400 status code if there is an incomplete object', () => {
      let house = {stories: 10};
      
      return superagent.post(__API_URL__)
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
      return superagent.get(__API_URL__)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });

    test('GET should respond with 200 and array of houses, up to 10', () => {
      return houseMock.many(100)
        .then(() => {
          return superagent.get(__API_URL__);
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

      return houseMock.create()
        .then(house => {
          houseToTest = house;
          return superagent.get(`${__API_URL__}/${house._id}`);
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
      return superagent.get(`${__API_URL__}/moosejaw`)
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

      return houseMock.create()
        .then(house => {
          housePut = house;
          return superagent.put(`${__API_URL__}/${house._id}`)
            .send({name: 'BIG MANSION'});
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body.name).toEqual('BIG MANSION');
          expect(response.body.stories).toEqual(housePut.stories);
          expect(response.body.climate).toEqual(housePut.climate);
          expect(response.body._id).toEqual(housePut._id.toString());
          expect(response.body.timestamp).not.toBeNull();
        });
    });

    test('PUT should respond with 404 if id is not found', () => {
      return superagent.put(`${__API_URL__}/moosejaw`)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });
    
    test('PUT should respond with 409 if you are trying to use a name that already exists', () => {
      return houseMock.many(2)
        .then(houses => {
          return superagent.put(`${__API_URL__}/${houses[0]._id}`)
            .send({
              name: houses[1].name,
            });
        })
        .then(response => {
          expect(response).toEqual('nothing because this will not show');
        })
        .catch(error => {
          expect(error.status).toEqual(409);
        });
    });
  });

  // ===================== DELETE =====================
  describe('DELETE /api/house/:id', () => {
    test('DELETE should respond with 204 and data if no error', () => {

      return houseMock.create()
        .then(house => {
          return superagent.delete(`${__API_URL__}/${house._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });

    test('DELETE should respond with 404 if id is not found', () => {
      return superagent.delete(`${__API_URL__}/moosejaw`)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });
  });
});