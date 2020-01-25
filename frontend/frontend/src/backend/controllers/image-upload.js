const express = require("express");
const expressRouter = express.Router();
const config = require("../config.json");
const mongoAccountProfile = require("../models/account_profile");
const mongoProfile = require("../models/profile");
const multer = require('multer');
const upload = multer();

expressRouter.post("/:meta/:uuid", upload.single("image"), async (request, response) =>{
  const token = request.token;
  const file = request.file;

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
  console.log("Request file ", request.file)

  const profile = await mongoProfile.findOneAndUpdate({account_profile: accountProfile._id}, {"$push":
      {"images": {
          publishing_type: 1,
          uuid: request.params.uuid,
          meta: request.params.meta,
          content_type: file.mimetype,
          contentbinary: file.buffer
      }
  }});

  const savedProfile = await profile.save();

  response.status(200).end()

});

expressRouter.get("/", async (request, response) =>{
  console.log("asd")

});

module.exports = expressRouter;