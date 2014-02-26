'use strict';

var databaseUrl = "mongodb://127.0.0.1:27017/noteditnote"; 
var collections = ["mails", "posts"]
var db = require("mongojs").connect(databaseUrl, collections);

module.exports = function (app) {

    app.get('/', function(req, res) {
        db.posts.find().sort({time:-1}, function(err, posts) {
            if (err) {
                throw "error raised: " + err;
            }
            res.render('index', {name: 'noteditnote', posts: posts });
        });
    });

};