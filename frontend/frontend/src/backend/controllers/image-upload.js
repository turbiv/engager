const express = require("express");
const expressRouter = express.Router();
const config = require("../config.json");
const mongoAccountProfile = require("../models/account_profile");
const mongoProfile = require("../models/profile");
const wrapper = require("../utils/wrapper");
const mongoose = require("mongoose");
const fs = require("fs");

expressRouter.post("/", async (request, response) =>{
  const token = request.token;
  const body = request.body;

  /*
  if(!token) {
    return response.status(config.response.badrequest).send({error: "authorization token is missing"})
  }

  if(!body){
    return response.status(config.response.badrequest).send({error: "missing body"})
  }

  const user = await wrapper.getAccountFromToken(token);
  if(!user){
    return response.status(config.response.unauthorized).send("failed to authorize").end()
  }

   */

  const accountProfile = await mongoAccountProfile.findOne({account_id: "5de1ae461670400000996d00"})
    .catch(() => response.status(config.response.notfound).send({error: "profile not found"}).end());

  const profile = await mongoProfile.findOne({account_profile: accountProfile._id});

  const sellable = profile.categories.find(category =>
    category.sellables.find(sellable => sellable._id.toString() === body.id ? sellable : null)
  );

  console.log(sellable)
  console.log(profile.categories)
  console.log(body)

  response.status(200).end()
});

expressRouter.get("/", async (request, response) =>{
  console.log("asd")

});

module.exports = expressRouter;