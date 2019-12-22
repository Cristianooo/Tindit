
const express = require("express");
const Connection = require('./connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();
const Records = require('./records');

router.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, 10).then(hash =>{
    const User = {
      email: req.body.email,
      username: req.body.username,
      password: hash,
    }
    Records.insertUser(User, function(err){
      if(err)
      {
        res.status(500).json(err);
      }
      else{
        res.json({
          message: "User inserted!"
        });
      }
    })

  })

})


router.post("/login", (req, res) => {

    Records.checkUser(req.body.email, function(err,rows){
      if(err) {
        console.log(err);
      }
      else
      {
        bcrypt.compare(req.body.password, rows[0].password).then( result => {
          if (!result){
            res.status(401).json({
              message: "Auth failed"
            })
          }
          else{
            const token = jwt.sign({email: req.body.email, userId: rows[0].UID}, 'yo_wtf_going_on_in_miami_bruh',
              {expiresIn: "1h"});
            res.status(200).json({
              token:token,
              expiresIn: 3600,
              userId: rows[0].UID,
            });
          }

        }).catch(err=>{
          console.log(err);
          res.status(401).json({
            message: "Auth failed"
          })
        })
      }
    });

})

router.get("/getUser", (req, res) => {
  Records.getUser(req.query.userid, function(err,rows){
    if(err) {
      console.log(err);
    }
    else
    {
      res.json(rows[0].username);
    }
  });

});

module.exports = router
