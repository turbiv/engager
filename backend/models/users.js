const mongo = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongo.set('useNewUrlParser', true);
mongo.set('useFindAndModify', false);
mongo.set('useCreateIndex', true);
mongo.set('useUnifiedTopology', true);

const userSchema = mongo.Schema({
  account_id: mongo.Schema.Types.ObjectId,
  account_key: {type: String, unique: true},
  registration_id: {type: Number, unique: true},
  emails: [String]
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const users = mongo.model('users', userSchema);

module.exports = users;