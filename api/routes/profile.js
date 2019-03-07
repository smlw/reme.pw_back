const express = require('express');
const router = express.Router();
const models = require('../models');

const Profile = models.Profile;

router.get('/profile/add', async (req, res) => {
    res.send('ok')    
})

router.post('/profile/add', async (req, res, next) => {
  const profile = new Profile({
    fio: req.body.fio,
    birthday: req.body.birthday
  });

  profile
    .save()
    .then(() => {
      res.status(201).json({
        success: true,
        message: 'Новый профайл успешно создан'
      })
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: err
      })
    })
})

module.exports = router;