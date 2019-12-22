const Connection = require('./connection');

const Records = {
  getSwipes: function (Records, callback) {
    const queryResult = Connection.query('SELECT PostID, upvote, SubType, voteTime FROM Swipes WHERE UID = "' + Records + '"', callback);
    return queryResult.values;
  },
  insertSwipe: function (Records, callback){
    return Connection.query('INSERT INTO Swipes(UID, PostID, upvote, SubType, voteTime) VALUES (?,?,?,?,NOW())', [Records.userId, Records.post.postId, Records.upvote, Records.post.postType])
  },
  insertUser: function (User, callback) {
    Connection.query('INSERT INTO Users(email, username, password) values(?, ?, ?)', [User.email, User.username, User.password], callback);
  },
  checkUser: function (email, callback) {
    Connection.query('SELECT password, UID FROM Users WHERE email = ? ;', [email], callback);
    return callback;
  },
  getUser: function(UID, callback) {
    Connection.query('SELECT username FROM Users WHERE UID = ? ;', [UID], callback);
    return callback;
  },
  test: function (callback){
    const testQuery = Connection.query('SELECT * FROM Users', callback);
    console.log(testQuery);
  }

};

module.exports = Records;
