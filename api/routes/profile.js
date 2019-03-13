const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require("mongoose");
const upload = multer({dest: 'uploads/'});

const models = require('../models');
const Profile = models.Profile;

router.get('/profiles', async (req, res) => {
  console.log(req.user)
  await models.Profile.find({
    owner: "5c83fe4a08bab53458a7c337"
  })
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
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
})

router.get('/profile/:profileId', async (req, res) => {
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

router.post('/profile/add', async (req, res, next) => {
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
        message: 'Новый профайл успешно создан',
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
        error: err
      })
    })
})

module.exports = router;