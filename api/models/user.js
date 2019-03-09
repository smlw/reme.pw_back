const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')
const Schema = mongoose.Schema;

const schema = new Schema({
  vkontakteId: {type: String},
  displayName: {type: String},
  photoUrl:    {type: String}
}, {
  timestamps: true
});

schema.plugin(findOrCreate);

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('User', schema);