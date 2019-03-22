const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const models = require('../models');
const Profile = models.Profile;

// Выгружаем все профайлы юзера
router.get('/', async (req, res) => {
  await models.Profile.find({
    owner: req.user.id
  })
    .exec()
    .then(docs => {
      const response = {
        message: `Количество загруженных профайлов: ${docs.length}`,
        profiles: docs.map(doc => {
          return {
            id: doc._id,
            fullName: doc.fullName,
            birthday: doc.birthday,
            avatar: doc.avatar,
          }
        })
      }
      res.status(200).json(response)
      // console.log(response)
    })
    .catch(err => {
      res.json({
        message: 'Ошибка при загрузке профайлов.'
      })
      throw err
    })
})

router.get('/:profileId', async (req, res) => {
  const id = req.params.profileId
  models.Profile.findById(id)
  .populate('interest')
  .exec(function(err, profile) {
    if(err) console.log(err)
    console.log(profile)
    res.status(200).json({
      profile
    })
  })
})

router.post('/add', async (req, res, next) => {
  const interestID = new mongoose.Types.ObjectId()
  const profileID = new mongoose.Types.ObjectId()
  console.log(interestID, profileID)
  const profile = new Profile({
    _id: profileID,
    owner: req.body.owner,
    fullName: req.body.fullName,
    birthday: req.body.birthday,
    avatar: req.body.avatar,
    interest: interestID
  });
  const interest = new models.Interest({
    _id: interestID,
    profile: profileID
  })

  interest
    .save()
    .then(result => {
      console.log(result)
    })
  profile
    .save()
    .then(result => {
      res.status(201).json({
        status: true,
        message: 'Новый профайл успешно создан!',
        createdProfile: {
          fullName: result.fullName,
          birthday: result.birthday,
          id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:8080/profile/" + result._id
          }
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        status: false,
        message: `Ошибка! Код ошибки: ${err.code}. Повторите позже!`,
      })
      throw err
    })
})

module.exports = router;