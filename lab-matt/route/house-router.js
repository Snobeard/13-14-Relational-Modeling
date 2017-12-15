'use strict';

const {Router} = require('express');
const jsonParser = require('express').json();
// const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const House = require('../model/house');
const log = require('../lib/logger');

const houseRouter = module.exports = new Router();

// ===================== POST ROUTES =====================
houseRouter.post('/api/house', jsonParser, (request, response, next) => {
  log('info', `==NAME==: ${request.body.name}`);
  log('info', `==STORIES==: ${request.body.stories}`);
  log('info', `==CLIMATE==: ${request.body.climate}`);

  if (!request.body.name || !request.body.stories || !request.body.climate) {
    return next(httpErrors(400), 'name, stories and climate are require');
  }

  new House(request.body).save()
    .then(house => {
      log('info', `==_ID==: ${house._id}`);
      log('info', `==TIMESTAMP==: ${house.timestamp}`);
      log('info', 'POST - responding with a 200 status');
      response.json(house);
      return;
    })
    .catch(next);
});

// ===================== GET ROUTES =====================
houseRouter.get('/api/house', (request, response, next) => {
  return House.find({})
    .limit(10)
    .then(allHouses => {
      // log('info', `==HOUSES ARRAY==: ${allHouses}`);
      if (allHouses.length === 0) {
        throw httpErrors(404, 'no houses listed');
      }
      log('info', 'GET - responding with a 200 status');
      return response.json(allHouses);
    })
    .catch(next);
});

houseRouter.get('/api/house/:id', (request, response, next) => {
  return House.findById(request.params.id)
    .then(house => {
      log('info', `==HOUSE==: ${house}`);
      if (!house) {
        throw httpErrors(404, 'house not found');
      }
      log('info', 'GET - responding with a 200 status');
      return response.json(house);
    })
    .catch(next);
});

// ===================== PUT ROUTES =====================
houseRouter.put('/api/house/:id', jsonParser, (request, response, next) => {
  if (!request.params.id) {
    throw httpErrors(400, 'no ID given');
  }
  let updateOptions = {runValidators: true, new: true};

  return House.findByIdAndUpdate(request.params.id, request.body, updateOptions)
    .then(house => {
      if (!house) {
        throw httpErrors(404, 'house not found');
      } else {
        log('info', 'PUT - responding with a 200 status');
        return response.json(house);
      }
    })
    .catch(next);
});

// ===================== DELETE ROUTES =====================
houseRouter.delete('/api/house/:id', (request, response, next) => {
  if (!request.params.id) {
    throw httpErrors(400, 'no ID given');
  }

  return House.findByIdAndRemove(request.params.id)
    .then(house => {
      if (!house) {
        throw httpErrors(404, 'house not found');
      } else {
        log('info', 'DELETE - responding with a 204 status');
        return response.sendStatus(204);
      }
    })
    .catch(next);
});