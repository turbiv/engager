const mongo = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongo.set('useNewUrlParser', true);
mongo.set('useFindAndModify', false);
mongo.set('useCreateIndex', true);
mongo.set('useUnifiedTopology', true);

const account_profileSchema = mongo.Schema({
  profile_id: mongo.Schema.Types.ObjectId,
  account_id: mongo.Schema.Types.ObjectId,
  publishing_type: {type: Number, unique: true},
  json: {type: mongo.Schema.Types.ObjectId, ref: "profiles"}
});

account_profileSchema.plugin(uniqueValidator);

account_profileSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const account_profiles = mongo.model('account_profiles', account_profileSchema);

module.exports = account_profiles;