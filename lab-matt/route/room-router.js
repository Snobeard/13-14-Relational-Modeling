'use strict';

const {Router} = require('express');
const jsonParser = require('express').json();
const httpError = require('http-errors');

const Room = require('../model/room');
const log = require('../lib/logger');

const roomRouter = module.exports = new Router();

// ===================== POST ROUTES =====================
roomRouter.post('/api/room', jsonParser, (request, response, next) => {
  log('info', `==NAME==: ${request.body.name}`);
  log('info', `==SQUAREFEET==: ${request.body.squareFeet}`);
  log('info', `==FLOORING==: ${request.body.flooring}`);
  log('info', `==HOUSEID==: ${request.body.house}`);
  

  if (!request.body.name || !request.body.squareFeet || !request.body.flooring) {
    return next(httpError(400), 'name, squareFeet and flooring are require');
  }

  new Room(request.body).save()
    .then(room => {
      log('info', `==_ID==: ${room._id}`);
      log('info', `==TIMESTAMP==: ${room.timestamp}`);
      log('info', 'POST - responding with a 200 status');
      response.json(room);
      return;
    })
    .catch(next);
});

// ===================== GET ROUTES =====================
roomRouter.get('/api/room', (request, response, next) => {
  return Room.find({})
    .limit(10)
    .then(allRooms => {
      log('info', `==ROOMS ARRAY==: ${allRooms}`);
      if (allRooms.length === 0) {
        throw httpError(404, 'no rooms listed');
      }
      log('info', 'GET - responding with a 200 status');
      return response.json(allRooms);
    })
    .catch(next);
});

roomRouter.get('/api/room/:id', (request, response, next) => {
  return Room.findById(request.params.id)
    .populate('house')
    .then(room => {
      log('info', `==ROOM==: ${room}`);
      if (!room) {
        throw httpError(404, 'room not found');
      }
      log('info', 'GET - responding with a 200 status');
      return response.json(room);
    })
    .catch(next);
});

// ===================== PUT ROUTES =====================
roomRouter.put('/api/room/:id', jsonParser, (request, response, next) => {
  if (!request.params.id) {
    throw httpError(400, 'no ID given');
  }
  let updateOptions = {runValidators: true, new: true};
  return Room.findByIdAndUpdate(request.params.id, request.body, updateOptions)
    .then(room => {
      if (!room) {
        throw httpError(404, 'room not found');
      } else {
        log('info', 'PUT - responding with a 200 status');
        return response.json(room);
      }
    })
    .catch(next);
});

// ===================== DELETE ROUTES =====================
roomRouter.delete('/api/room/:id', (request, response, next) => {
  if (!request.params.id) {
    throw httpError(400, 'no ID given');
  }

  return Room.findByIdAndRemove(request.params.id)
    .then(room => {
      if (!room) {
        throw httpError(404, 'room not found');
      } else {
        log('info', 'DELETE - responding with a 204 status');
        return response.sendStatus(204);
      }
    })
    .catch(next);
});