const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  owner:      {type: String, required: true},
  fullName:   {type: String, required: true},
  marital:    {type: String, required: false},
  avatar:     {type: String, required: false},
  birthday:   {type: Date, required: false},
  profession: {type: String},
  sections: [{
    sectionTitle: {type: String},
    sectionAlias: {type: String},
    showAddForm:  {type: Boolean, default: false},
    items:        {type: Array, default: []}
  }]
}, {
  timestamps: true
});

const defaultSections = [
  {
    sectionTitle: 'Хобби',
    sectionAlias: 'hobbies',
    showAddForm: false,
    items: [
      {name: 'Программирование'},
      {name: 'Качалка'},
      {name: 'Настольный теннис'},
      {name: 'Вечеринки'}
    ]
  }
]

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Profile', schema);