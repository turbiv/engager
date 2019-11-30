const {OAuth2Client} = require('google-auth-library');
const mongoUsers = require("../models/users");
const mongoAccountProfile = require("../models/account_profile");

const CLIENT_ID = '922637484566-v5444u8s19lvt81d1vu07kgt3njtemo5.apps.googleusercontent.com';

const valideToken = async (token) => {
  const client = new OAuth2Client(CLIENT_ID);

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

const getAccountFromToken = async (token) =>{

  const decodedToken = await valideToken(token);
  if(!decodedToken){
     return false
  }

  const user = await mongoUsers.findOne({emails: decodedToken.email})
    .catch(() => false);

  return user
};

module.exports = {getAccountFromToken, valideToken};