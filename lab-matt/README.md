# 14: Relational-Modeling
Description: **Lab 14 of Code Fellows JavaScript 401d19** </br>
Author: **Matthew LeBlanc** </br>
Date: **12/14/17**

## Features
This lab implements creation of an http server using express.js using mongodb/mongoose to create a relational database

## Tech/Framework Used
- node.js
- javascript
- mongodb
- Visual Studio Code

## Requirements
- node.js
- mongodb


## Usage
1. `cd` into the lab-matt folder
2. `npm install` the required dependency packages
3. `.env` values are automatically setup for jest testing</br>
they will be required for non-testing purposes
```
PORT=3000
MONGODB_URI=mongodb://localhost/testing
```
4. `npm run dbon` to initiate the mongo database
5. `npm run test` to run the jest testing

## Dependencies
1. `dotenv`
2. `express`
3. `faker`
4. `http-errors`
5. `mongoose`
6. `superagent`
7. `winston`
##### <u>DEV</u>
1. `eslint`
2. `jest`

## Server Endpoints
- `POST /api/house` - Create a new house data-object
- `GET /api/room/` - retrieve an array of all the houses
- `GET /api/house/<id>` - retrieve a saved house based on ID
- `PUT /api/house/<id>` - update a saved house based on ID
- `DELETE /api/house/<id>` - delete a saved house based on ID </br></br>
- `POST /api/room` - Create a new room data-object
- `GET /api/room/` - retrieve an array of all the rooms
- `GET /api/room/<id>` - retrieve a saved room based on ID
- `PUT /api/room/<id>` - update a saved room based on ID
- `DELETE /api/room/<id>` - delete a saved room based on ID

## Tests
`POST /api/house` => 200 status code if no issues and the house was submitted </br>
`POST /api/house` => 400 status code if the data is incomplete </br>
`POST /api/house` => 409 status code if the unique data is duplicated</br>

`GET /api/house` => 404 status code if no houses were listed </br>
`GET /api/house` => 200 status code if a response with an array of houses </br>
`GET /api/house/<id>` => 200 status code if the house was retrieved with the given id </br>
`GET /api/house/<id>` => 404 status code if no house is found with the given id </br>

`PUT /api/house/<id>` => 200 status code if no error and data is updated </br>
`PUT /api/house/<id>` => 404 status code if no house was found with the given id  </br>
`PUT /api/house/<id>` => 409 status code if the unique data you're trying to label already exists</br>

`DELETE /api/house/<id>` => 204 status code if id found and data removed </br>
`DELETE /api/house/<id>` => 404 status code if no id is found </br>

All the same for the rooms, besides no 409's because the names are generic, and not unique.