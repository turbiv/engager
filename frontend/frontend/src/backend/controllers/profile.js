const mongo = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongo.set('useNewUrlParser', true);
mongo.set('useFindAndModify', false);
mongo.set('useCreateIndex', true);
mongo.set('useUnifiedTopology', true);

const profileSchema = mongo.Schema({
  account_id: {type: Number, unique: true},
  profile_id: {type: String, unique: true},
  json: {type: Map, unique: false},
});

profileSchema.plugin(uniqueValidator);

profileSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const profiles = mongo.model('profiles', profileSchema);

module.exports = profiles;