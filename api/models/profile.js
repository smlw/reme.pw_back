const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    fio      : {type: String, required: false},
    birthday : {type: Date, required: false},
}, {
    timestamps: true
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Profile', schema);