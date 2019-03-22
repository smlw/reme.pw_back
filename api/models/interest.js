const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

const schema = new Schema({
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  interest: {
    type: [{
      name      : { type: String, default: 'Value' },
      icon      : { type: String },
      color     : { type: String },
      textColor : { type: String },
    }],
    default: [{
      name: 'Музыка'
    }]
  }
}, {
  timestamps: true
});

schema.set('toJSON', {virtuals: true});
schema.plugin(autopopulate);

module.exports = mongoose.model('Interest', schema);