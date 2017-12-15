'use strict';

const express = require('express');
const mongoose = require('mongoose');
const log = require('./logger');

// ================ ENV VALUES ===================
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

// ================ MONGO DB SETUP ===================
mongoose.Promise = Promise;

// ================ SERVER SETUP ===================
const server = module.exports = {};

const app = express();

// ================ ROUTE SETUP ===================
app.use(require('./logger-middleware'));
app.use(require('../route/room-router'));
app.use(require('../route/house-router'));

app.all('*', (request, response) => {
  log('info', 'Returning a 404 from the catch-all route');
  return response.sendStatus(404);
});

// ================ ERROR MIDDLEWARE ===================
app.use(require('./error-middleware'));

// ================ SERVER USE ===================
let isServerOn = false;
let httpServer = null;

server.start = () => {
  return new Promise((resolve, reject) => {

    if (isServerOn) {
      log('error', '__SERVER_ERROR__ Server is already on');
      return reject(new Error('__SERVER_ERROR__ Server is already on'));
    }
    httpServer = app.listen(PORT, () => {
      isServerOn = true;
      log('info', `Server is listening on port: ${PORT}`);
      return resolve();
    });
  })
    .then(() => {
      mongoose.connect(MONGODB_URI, {useMongoClient: true});
    });
};

server.stop = () => {
  return new Promise((resolve, reject) => {

    if (!isServerOn) {
      log('error', '__SERVER_ERROR__ Server is already off');
      return reject(new Error('__SERVER_ERROR__ Server is already off'));
    }
    if (!httpServer) {
      log('error', '__SERVER_ERROR__ There is no server to close');
      return reject(new Error('__SERVER_ERROR__ There is no server to close'));
    }
    httpServer.close(() => {
      isServerOn = false;
      httpServer = null;
      log('info', `Server is shutting down`);
      return resolve();
    });
  })
    .then(() => {
      mongoose.disconnect();
    });
};