const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const models = require('../models');
const Interest = models.Interest;

router.get('/', async (req, res) => {
  Interest.find()
  .exec()
  .then(docs => {
    console.log('interests docs')
    if (docs) {
      res.status(200).json({
        docs
      })
    } else {
      res.status(404).json({
        message: '404'
      })
    }
  })
})
router.post('/add', async (req, res, next) => {
  const profile = await models.Interest.findOne({
    profile: "5c908729d6b2240b440019b2"
  })

  if (!profile) {
    await models.Interest.create({
      owner: "5c8a86dd319bb02764965267",
      profile: "5c908729d6b2240b440019b2"
    })
  } else {
    await models.Interest.updateOne(
      { profile: "5c908729d6b2240b440019b2" },
      { 
        $push : {
          interest: {
            name: 'Зомби'
          }
        }
      }
    )
  }
})

module.exports = router;