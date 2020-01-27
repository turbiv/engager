const express = require("express");
const expressRouter = express.Router();
const config = require("../config.json");
const mongoAccountProfile = require("../models/account_profile");
const mongoProfile = require("../models/profile");
const wrapper = require("../utils/wrapper");
const multer = require('multer');
const upload = multer();

expressRouter.post("/:meta/:uuid", upload.single("image"), async (request, response) =>{
  const token = request.token;
  const file = request.file;

  if(!token) {
    return response.status(config.response.badrequest).send({error: "authorization token is missing"}).end()
  }

  if(!file){
    return response.status(config.response.badrequest).end({error: "missing file"}).end()
  }

  const user = await wrapper.getAccountFromToken(token);
  if(!user){
    return response.status(config.response.unauthorized).send("failed to authorize").end()
  }

  const accountProfile = await mongoAccountProfile.findOne({account_id: user.account_id})
    .catch(() => response.status(config.response.notfound).send({error: "profile not found"}).end());

  const profile = await mongoProfile.findOneAndUpdate({account_profile: accountProfile._id}, {"$push":
      {"images": {
          publishing_type: 1,
          uuid: request.params.uuid,
          meta: request.params.meta,
          content_type: file.mimetype,
          contentbinary: file.buffer
      }
  }})
    .catch(() => response.status(config.response.badrequest).send({error: "failed to add image"}).end());

  await profile.save();

  response.status(config.response.ok).end()

});

expressRouter.get("/:publishingtype/:uuid", async (request, response) =>{
  const params = request.params;

  //Find using uuid and publishingtype
  const result = await mongoProfile.findOne({"images.uuid": params.uuid, "images.publishing_type": 1}, {"images.$": 1})
    .catch(() => response.status(config.response.notfound).send({error: "failed to search profile"}).end());

  if(!result){
    response.status(config.response.notfound).send({error: "profile not found"}).end()
  }

  if(result.images.length > 1){
    response.status(config.response.badrequest).send({error: "Multiple images found"}).end()
  }

  response.header("Content-Type", result.images[0].content_type)
  response.status(config.response.ok).end(result.images[0].contentbinary, "binary")
});

expressRouter.delete("/", async (request, response) =>{
  const body = request.body;
  const token = request.token;

  if(!token) {
    return response.status(config.response.badrequest).send({error: "authorization token is missing"}).end()
  }

  if(!body){
    return response.status(config.response.badrequest).end({error: "missing body"}).end()
  }

  const user = await wrapper.getAccountFromToken(token);
  if(!user){
    return response.status(config.response.unauthorized).send("failed to authorize").end()
  }

  const accountProfile = await mongoAccountProfile.findOne({account_id: user.account_id})
    .catch(() => response.status(config.response.notfound).send({error: "profile not found"}).end());

  const profile = await mongoProfile.findOneAndUpdate({account_profile: accountProfile._id, "images.uuid": body.uuid}, {"$pull":
      {"images": {
          publishing_type: 1,
          uuid: body.uuid
        }
      }})
    .catch(() => response.status(config.response.badrequest).send({error: "failed to add image"}).end());

  response.status(config.response.ok).end()

});

module.exports = expressRouter;