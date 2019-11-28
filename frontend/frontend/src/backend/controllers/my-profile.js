const express = require("express");
const expressRouter = express.Router();
const config = require("../config.json");
const mongoUsers = require("../models/users");
const {OAuth2Client} = require('google-auth-library');

const CLIENT_ID = '922637484566-v5444u8s19lvt81d1vu07kgt3njtemo5.apps.googleusercontent.com';

const client = new OAuth2Client(CLIENT_ID);

const valideToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    const email = payload['email'];

    return {userid, email}
  }catch{
    return undefined
  }
};

expressRouter.get('/', async (request, response) =>{
  const token = request.token;
  if(!token){
    return response.status(config.response.badrequest).send({error: "authorization token is missing"})
  }

  const decodedToken = await valideToken(token);

  if(!decodedToken){
    return response.status(config.response.unauthorized).send({error: "authorization failed"})
  }

  const user = await mongoUsers.findOne({emails: decodedToken.email})
    .catch(() => response.status(config.response.notfound).send({error: "user not found"}).end());



});


module.exports = expressRouter;