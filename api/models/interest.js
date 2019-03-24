const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

const schema = new Schema({
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  interest: {
    type: [{
      name      : { type: String, default: 'Value' },
      icon      : { type: String },
      color     : { type: String },
      textColor : { type: String },
      chips: [{
        id: Schema.Types.ObjectId,
        chipName  : { type: String },
        color     : { type: String }
      }]
    }],
    default: [{
      name: 'Музыка',
      icon: 'fa-music',
      color: 'indigo',
      textColor: 'white',
      chips: [{
        chipName: 'Поп-музыка',
        color: 'indigo'
      }]
    }]
  }
}, {
  timestamps: true
});

schema.set('toJSON', {virtuals: true});
schema.plugin(autopopulate);

module.exports = mongoose.model('Interest', schema);