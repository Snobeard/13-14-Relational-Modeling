'use strict';

require('./lib/setup');

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');

const roomMock = require('./lib/room-mock');
const houseMock = require('./lib/house-mock');

const __API_URL__ = `http://localhost:${process.env.PORT}/api/room`;

describe('/api/room', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(roomMock.remove);

  // ===================== POST =====================
  describe('POST /api/room', () => {
    test('POST should respond with 200 and data if no error', () => {
      let roomToPost = {
        name: faker.random.arrayElement(['bedroom', 'bathroom', 'master bedroom', 'garage', 'kitchen', 'dining area', 'living room']),
        squareFeet: faker.random.number({min: 100, max: 1000}),
        flooring: faker.random.arrayElement(['hardwood', 'carpet', 'granite', 'tile', 'heated wood', 'heated tile']),
      };
     
      return houseMock.create()
        .then(house => {
          roomToPost.house = house._id;
          
          return superagent.post(__API_URL__)
            .send(roomToPost)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toBeTruthy();
              expect(response.body.timestamp).toBeTruthy();
              
              expect(response.body.name).toEqual(roomToPost.name);
              expect(response.body.stories).toEqual(roomToPost.stories);
              expect(response.body.climate).toEqual(roomToPost.climate);

              expect(response.body.house).toEqual(house._id.toString());
            });
        });
    });
    
    test('POST should respond with 409 if there is a duplicate name', () => {
      return roomMock.create()
        .then(mockObject => {
          return superagent.post(__API_URL__)
            .send({
              name: mockObject.room.name,
              squareFeet: mockObject.room.squareFeet,
              flooring: mockObject.room.flooring,
              house: mockObject.room.house,
              _id: mockObject.room._id,
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
      let room = {name: 'kitchen'};
      
      return superagent.post(__API_URL__)
        .send(room)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(400);
        });
    });
  });

  // ===================== GET =====================
  describe('GET /api/room', () => {
    test('GET should respond with 404 if no rooms are listed', () => {
      return superagent.get(__API_URL__)
        .then(response => {
          console.log('this should not show', response);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
        });
    });

    test('GET should respond with 200 and array of rooms, up to 10', () => {
      return roomMock.many(100)
        .then(() => {
          return superagent.get(__API_URL__);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toEqual(10);
        });
    });
  });

  describe('GET /api/room/:id', () => {
    test('GET should respond with 200 and data if no error', () => {
      let roomAndHouse = null;

      return roomMock.create()
        .then(mockObject => {
          roomAndHouse = mockObject;
          return superagent.get(`${__API_URL__}/${mockObject.room._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(roomAndHouse.room._id.toString());
          expect(response.body.timestamp).toBeTruthy();
          
          expect(response.body.name).toEqual(roomAndHouse.room.name);
          expect(response.body.squareFeet).toEqual(roomAndHouse.room.squareFeet);
          expect(response.body.flooring).toEqual(roomAndHouse.room.flooring);

          // mattL - this line checks to see if the house has the room id in its list
          expect(response.body.house.rooms[0]).toEqual(roomAndHouse.room._id.toString());
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
  describe('PUT /api/room/:id', () => {
    test('PUT should respond with 200 and data if no error and data should be updated', () => {
      let roomAndHouse = null;

      return roomMock.create()
        .then(mockObject => {
          roomAndHouse = mockObject;
          return superagent.put(`${__API_URL__}/${mockObject.room._id}`)
            .send({name: 'THEATRE ROOM!'});
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body.name).toEqual('THEATRE ROOM!');
          expect(response.body.squareFeet).toEqual(roomAndHouse.room.squareFeet);
          expect(response.body._id).toEqual(roomAndHouse.room._id.toString());
          expect(response.body.timestamp).not.toBeNull();
          expect(response.body.house).toEqual(roomAndHouse.house._id.toString());
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
    
    // test('PUT should respond with 409 if you have unique properties', () => {
    //   return roomMock.many(2)
    //     .then(mockObject => {
    //       console.log(mockObject);
    //       return superagent.put(`${__API_URL__}/${mockObject.rooms[0]._id}`)
    //         .send({
    //           _id: mockObject.rooms[1]._id,
    //         });
    //     })
    //     .then(response => {
    //       expect(response).toEqual('nothing because this will not show');
    //     })
    //     .catch(error => {
    //       expect(error.status).toEqual(409);
    //     });
    // });
  });

  // ===================== DELETE =====================
  describe('DELETE /api/room/:id', () => {
    test('DELETE should respond with 204 and data if no error', () => {

      return roomMock.create()
        .then(mockObject => {
          return superagent.delete(`${__API_URL__}/${mockObject.room._id}`);
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