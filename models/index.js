'use strict';


var databaseUrl = "mongodb://127.0.0.1:27017/noteditnote"; 
var collections = ["mails", "posts"];

var db = require("mongojs").connect(databaseUrl, collections);
var ega;

db.posts.find({}, function(err, posts) {

  if (err || !posts) {
    console.log("error posts");
  } else {
    ega = [
      {id: 'x', text: "x", name: 'x', time: 'x' },
      {id: 'x', text: "x", name: 'x', time: 'x' }
    ];
  }
});

module.exports = function IndexModel() {
  return {
    name: 'noteditnote',
    posts: ega
  }
};