const express = require("express");
const expressRouter = express.Router();
const config = require("../config.json");
const mongoAccountProfile = require("../models/account_profile");
const mongoProfile = require("../models/profile");
const wrapper = require("../utils/wrapper");

expressRouter.get('/', async (request, response) =>{
  const token = request.token;
  if(!token){
    return response.status(config.response.badrequest).send({error: "authorization token is missing"})
  }

  const user = await wrapper.getAccountFromToken(token);
  if(!user){
    return response.status(config.response.unauthorized).send("failed to authorize").end()
  }

  const profile = await mongoAccountProfile.findOne({account_id: user.account_id})
    .populate("json")
    .catch(() => response.status(config.response.notfound).send({error: "profile not found"}).end());

  if(!profile.json){
    return response.status(config.response.ok).send("").end()
  }
  response.status(config.response.ok).send(profile.json).end()
});

expressRouter.post('/', async (request, response) =>{
  const token = request.token;
  const body = request.body;

  if(!token){
    return response.status(config.response.badrequest).send({error: "authorization token is missing"})
  }

  if(!body){
    return response.status(config.response.badrequest).send({error: "missing body"})
  }

  const user = await wrapper.getAccountFromToken(token);
  if(!user){
    return response.status(config.response.unauthorized).send("failed to authorize").end()
  }

  const accountProfile = await mongoAccountProfile.findOne({account_id: user.account_id})
    .catch(() => response.status(config.response.notfound).send({error: "profile not found"}).end());

  if(!accountProfile.json){
    const profile = {account_profile: accountProfile._id, ...body};

    const newprofile = new mongoProfile(profile);
    const saved = await newprofile.save();

    const updateAccountJson = await mongoAccountProfile.findByIdAndUpdate(accountProfile._id, {json: saved._id});
    await updateAccountJson.save();
    return response.status(config.response.ok).end()
  }

  const updateProfile = await mongoProfile.findOneAndUpdate({account_profile: accountProfile._id}, {...body});
  updateProfile.save()
});


module.exports = expressRouter;