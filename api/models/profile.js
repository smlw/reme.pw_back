const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  owner:      {type: Schema.Types.ObjectId, required: true},
  fullName:   {type: String, required: true},
  marital:    {type: String, required: false},
  avatar:     {type: String, required: false},
  birthday:   {type: Date, required: false},
  profession: {type: String},
  interest: {
    type: Schema.Types.ObjectId,
    ref: 'Interest'
  }
}, {
  timestamps: true
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Profile', schema);