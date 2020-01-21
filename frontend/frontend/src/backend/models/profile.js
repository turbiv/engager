const mongo = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongo.set('useNewUrlParser', true);
mongo.set('useFindAndModify', false);
mongo.set('useCreateIndex', true);
mongo.set('useUnifiedTopology', true);

const profileSchema = mongo.Schema({
  account_profile: mongo.Schema.Types.ObjectId, //Registered account to the profile
  categories: [
    new mongo.Schema({
      name: String,
      id: String,
      sellables: [
        new mongo.Schema({
          cat: String,
          id: String,
          name: String,
          oldprice: [],
          price: [],
          desc: String,
          intro: {
            size: {},
            path: String
          },
          promo: {
            size: {},
            square: {
              path: String,
              size: {}
            },
            time: {
              days: [],
              time_between: [String]
            },
            push: Boolean,
            message: String,
            path: String
          },
          bonuses: []
        })
      ]
    })
  ],
  info: {
    phone: String,
    email: String,
    social: String,
    openHours: [String],
    address: [String],
    location: { lat: Number, lng: Number, preview: String }
  },
  images: [
    new mongo.Schema({
      publishing_type: Number, //Save as draft , int 1
      uuid: String,
      meta: String,
      content_type: String, //take from image , type (png , jpeg) image/png
      contentbinary: Buffer
    })
  ]
},{ minimize: false });

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