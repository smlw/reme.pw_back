const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require("mongoose");
const upload = multer({dest: 'uploads/'});

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
            birthday: doc.birthday
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
  Profile.findById(id)
    .exec()
    .then(doc => {
      // console.log("From database", doc)
      if (doc) {
        res.status(200).json({
            profile: doc
        });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
    })
})

router.post('/add', async (req, res, next) => {
  const profile = new Profile({
    _id: new mongoose.Types.ObjectId(),
    owner: req.body.owner,
    fullName: req.body.fullName,
    birthday: req.body.birthday,
    sections: req.body.sections
  });

  profile
    .save()
    .then(result => {
      res.status(201).json({
        status: true,
        message: 'Новый профайл успешно создан!',
        createdProfile: {
          fullName: result.fullName,
          birthday: result.birthday,
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