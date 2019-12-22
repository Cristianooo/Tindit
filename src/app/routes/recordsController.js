const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const Records = require('../../../backend/records');

router.get('/getSwipes', function (req, res) {
  Records.getSwipes(function(err,rows){
    if(err) {
      res.status(400).json(err);
    }
    else
    {
      res.json(rows);
    }
  });
});

router.post('/insertSwipes', function (req, res) {
  Records.insertSwipe(req.body,function(err,count){
    if(err)
    {
      res.status(400).json(err);
    }
    else{
      res.json(req.body);
    }
  });
});

module.exports = router;
