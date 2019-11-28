const express = require("express");
const expressRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("../config.json");

expressRouter.get('/:key/:type', async (request, response) =>{
  const body = request.body;
  const key = request.params.key;
  const type = request.params.type;

  if(!(key || type)){
    return response.status(config.response.badrequest).send({error: "key and type missing"}).end()
  }

  if(!(type === config.publish.production || type === config.publish.staging)){
   return response.status(config.response.badrequest).send({error: "Bad publishing"})
  }


});


module.exports = expressRouter;