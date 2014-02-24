'use strict';


var IndexModel = require('../models/index');


module.exports = function (app) {

    var model = new IndexModel();
	var databaseUrl = "mongodb://127.0.0.1:27017/noteditnote"; 
	var collections = ["mails", "posts"]
	var db = require("mongojs").connect(databaseUrl, collections);



        db.posts.find({}, function (err, posts) {
            if (err || !posts) {
                console.log("error posts");
            }
            var model =
            {
                posts: [
			        {id: 'x', text: "x", name: 'x', time: 'x' },
			        {id: 'x', text: "x", name: 'x', time: 'x' }
			      ]
      //posts
            };
            res.render('index', model);
        });

    });



};
