'use strict';


var IndexModel = require('../models/index');


module.exports = function (app) {

    var model = new IndexModel();
	var databaseUrl = "mongodb://127.0.0.1:27017/noteditnote"; 
	var collections = ["mails", "posts"]
	var db = require("mongojs").connect(databaseUrl, collections);

    app.get('/', function(req, res) {
        db.posts.find({}, function (err, posts) {
            console.log(posts);
            if (err) {
                throw "error raised: " + err;
            }
            res.render('index', { posts: posts });
        });
    });

};