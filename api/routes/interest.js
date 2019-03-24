const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const models = require('../models');

router.get('/:profileId', async (req, res) => {
  await models.Interest.findOne({
    owner: req.user.id,
    profile: req.params.profileId
  })
    .then(result => {
      res.status(200).json({
        interests: result
      })
    })
    .catch(err => {
      res.status(500).json({
        message: err
      })
    })
});

router.post('/remove', (req, res) => {
  // remove chips
  console.log('req.body')
  console.log(req.body)
  models.Interest.update({
    profile: req.body.profileID,
    'interest._id' : req.body.interestID,
    'interest.chips._id' : req.body.chipID
  }, {
    $pull: {
      'interest.$.chips' :  {
        _id: req.body.chipID
      }
    }
  })
    .then((result) => {
      res.status(200).json({
        message: 'Удаление успешно.'
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Ошибка удаления.'
      })
    })
})

router.post('/add', async (req, res, next) => {
  console.log(req.body)
  models.Interest.updateOne({
    profile: req.body.profileID,
    'interest._id' : req.body.interestID
  }, {
    $push: {
      'interest.$.chips':  {
        chipName: req.body.chipText
      }
    }
  })
    .then((result) => {
      res.status(200).json({
        message: 'Успешно.'
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Ошибка.'
      })
    })
})

module.exports = router;