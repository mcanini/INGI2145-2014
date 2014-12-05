var fs = require('fs');
var byline = require('byline');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var AM = require('./account-manager.js');
var noop = function() {};

mongo.connect('mongodb://localhost:27017/lab7', function(err, db) {

  assert.equal(null, err);
  users  = db.collection('users');
  console.log("connected correctly to server");

  users.remove({}, noop);

  function callback(err) {
      db.close();
  }

  var u = byline(fs.createReadStream(__dirname + '/users.json'));

  u.on('data', function(line) {
    try {
      var obj = JSON.parse(line);
      console.log(obj);
      AM.addNewAccount(obj, users, noop);
      // users.insert({
      //   username: obj.username,
      //   name: obj.name,
      //   followers: obj.followers,
      //   following: obj.following
      // }, noop);

    } catch (err) {
      console.log("Error:", err);
    }
  });
  u.on('end', callback);
});
