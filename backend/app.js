const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const Records = require('./records');
const user = require('./user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});


app.get("/getSwipes", function (req, res) {
  Records.getSwipes(req.query.userid,function(err,rows){
    if(err) {
      console.log(err);
    }
    else
    {
      let postIds= [];
      for (let row in rows){
        let Post = {postId: rows[row].PostID, upvote: rows[row].upvote, SubType: rows[row].SubType, voteTime: rows[row].voteTime};
        postIds.push(Post);
      }
      res.json(postIds);
    }
  });
});

app.post("/insertSwipe", function (req, res) {
  Records.insertSwipe(req.body,function(err){
    if(err)
    {
      res.status(400).json(err);
    }
    else{
      res.json("Swipe Inserted!");
    }
  });
});

app.get("/test", function(req, res){
  Records.test( function(err){
    if(err)
    {
      res.status(400).json(err);
    } else{
      res.json('Success')
    }
  })

})

app.use('/api/user', user);

module.exports = app;
