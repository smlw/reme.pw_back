const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");


router.get('/getUserProfile', async (req, res) => {
  if(req.user){
    res.json({
      user: req.user
    })

    // (req, res) => {
    //   const token = req.user.jwtoken;
    //   console.log(token)
    //   res.cookie('auth', token); // Choose whatever name you'd like for that cookie, 
    // }
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