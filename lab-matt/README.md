# 13: Relational-Modeling
Description: **Lab 13 of Code Fellows JavaScript 401d19** </br>
Author: **Matthew LeBlanc** </br>
Date: **12/13/17**

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
3. setup a `.env` file with the values
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
1. `POST /api/dogs` - Create a new dog data
2. `GET /api/dogs/<id>` - retrieve a saved dog based on ID
3. `PUT /api/dogs/<id>` - update a saved dog based on ID
4. `DELETE /api/dogs/<id>` - delete a saved dog based on ID