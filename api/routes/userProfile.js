const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");


router.get('/', async (req, res) => {
  console.log(req.session)

  res.json({
      user: req.user
  })
})

module.exports = router;