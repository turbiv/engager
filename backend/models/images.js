const mongo = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongo.set('useNewUrlParser', true);
mongo.set('useFindAndModify', false);
mongo.set('useCreateIndex', true);
mongo.set('useUnifiedTopology', true);

const imagesSchema = mongo.Schema({
  account_id: mongo.Schema.Types.ObjectId,
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

imagesSchema.plugin(uniqueValidator);

imagesSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const images = mongo.model('images', imagesSchema);

module.exports = images;