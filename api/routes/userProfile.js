const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");


router.get('/', async (req, res) => {
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

module.exports = router;