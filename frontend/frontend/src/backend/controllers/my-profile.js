const express = require("express");
const expressRouter = express.Router();
const config = require("../config.json");
const mongoAccountProfile = require("../models/account_profile");
const mongoProfile = require("../models/profile");
const wrapper = require("../utils/wrapper");
const mongoose = require("mongoose");

expressRouter.get('/', async (request, response) =>{
  /*
  Get user from token
  Find accountProfile using user.account_id (retrived from token) and populate with json
    if failed -> profile is null and a new accountprofile will be created without any data info (json empty)
    if success -> send accountProfile json data
  */

  const token = request.token;

  if(!token){
    return response.status(config.response.badrequest).send({error: "authorization token is missing"}).end()
  }

  const user = await wrapper.getAccountFromToken(token);
  if(!user){
    return response.status(config.response.unauthorized).send("failed to authorize").end()
  }

  const profile = await mongoAccountProfile.findOne({account_id: user.account_id})
    .populate("json")
    .catch(() => response.status(config.response.notfound).send({error: "profile not found"}).end());

  //Create profile for account if none exist

  if(profile === null){
    const newprofile = {
      account_id: user.account_id,
      publishing_type: 1,
      profile_id: mongoose.Types.ObjectId()
    };
    const savenewprofile = new mongoAccountProfile(newprofile);
    await savenewprofile.save();

    return response.status(config.response.ok).send("").end()
  }


  response.status(config.response.ok).send(profile.json).end()
});

expressRouter.post('/', async (request, response) =>{

  const token = request.token;
  const body = request.body;

  if(!token){
    return response.status(config.response.badrequest).send({error: "authorization token is missing"}).end()
  }

  if(!body){
    return response.status(config.response.badrequest).send({error: "missing body"}).end()
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

  const updateProfile = await mongoProfile.findOneAndUpdate({account_profile: accountProfile._id}, body);
  await updateProfile.save()
});


module.exports = expressRouter;