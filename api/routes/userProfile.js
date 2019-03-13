const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");


router.get('/getUserProfile', async (req, res) => {
  if(req.user){
    res.json({
        user: req.user
    })
  } else {
    res.json({
      user: null
    })
  }
})

router.get('/logout', async (req, res) => {
  req.logout();
  req.session.destroy();
})

module.exports = router;