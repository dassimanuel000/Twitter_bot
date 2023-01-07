var express = require("express");
var bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";
const { postTweet } = require('./bot');

var status = "";

var users = [];
var auth = [];

// # Initialise users and usertypes

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("groupe6");
    dbo.collection("users").find({}).toArray(function(err, result) {
        if (err) throw err;
        users = result;
        db.close();
    });
});


//calling express
var app = express();

//set the template engine
app.set('view engine', 'ejs');
//static data
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.render('index', { status: status });
});

app.get("/login", function(req, res) {
    res.render('login');
});

app.post("/login", function(req, res) {
    if (auth.length == 1) {

        res.redirect('/login?status=done');

    } else {
        if (req.body) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("groupe6");
                var auths = { 'mail': req.body.mail, 'pass': req.body.pass };

                dbo.collection("users").find(auths).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                    auth = result;
                    db.close();
                    if (result.length > 0) {
                        res.redirect('/dashboard');
                    } else {
                        res.redirect('/login?status=false');
                    }
                });
            });
        }
    }
});

app.get("/register", function(req, res) {
    res.render('register');
});

app.get("/sc", function(req, res) {
    console.log(users);
});

app.post("/register", function(req, res) {
    if (req.body) {
        if (auth.length == 1) {
            res.redirect('/login?status=done');
        } else {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("groupe6");
                var users_admin = [{
                    "_id": new ObjectID(),
                    "name": req.body.name,
                    "pass": req.body.pass,
                    "mail": req.body.mail,
                    "tel": req.body.tel,
                    "address": req.body.address,
                    "type": "user",
                    "status": "3",
                    "roles": [
                        "3",
                        "4"
                    ]
                }];
                dbo.collection("users").insertMany(users_admin, function(err, res) {
                    if (err) throw err;
                    console.log(res, "New user done ");
                    db.close();
                });
                res.redirect('/login?status=register');
            });
        }
    }
});


app.post("/edit_user/:id", function(req, res) {
    if (req.body) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("groupe6");
            dbo.collection("users").updateOne({ _id: new ObjectID(req.params.id) }, {
                    $set: {
                        "name": req.body.name,
                        "pass": req.body.pass,
                        "mail": req.body.mail,
                        "tel": req.body.tel,
                        "address": req.body.address,
                        "type": auth[0]['type'],
                        "status": auth[0]['status']
                    }
                }, { upsert: true },
                function(err, res) {
                    if (err) throw err;
                    console.log("1 document update");
                    console.log(res);
                    db.close();
                });
            res.redirect('/dashboard?status=done&m=user update');
        });
    }
});

app.get("/logout", function(req, res) {
    if (auth.length == 1) {
        auth = [];
        console.log("Logout Auth")
        res.redirect('/login?status=logout');
    } else {
        res.redirect('/login?status=need')
    }

});

app.get("/dashboard", function(req, res) {
    if (auth.length == 1) {
        res.render('dashboard/home', {
            auth: auth,
            users: users
        });
    } else {
        res.redirect('/login?status=need')
    }

});


app.get('/adduser', function(req, res) {
    var tools = require('./connectDB.js');
    tools.init_admin();
    res.redirect('/dashboard');
});

app.get('/hashtag', function(req, res) {
    var tools = require('./bot.js');
    tools.hashtag();
});


app.get('/LikeESTIAM', function(req, res) {
    var tools = require('./bot.js');
    tools.LikeESTIAM();
});

app.get('/retweetESTIAM', function(req, res) {
    var tools = require('./bot.js');
    tools.retweetESTIAM();
});


app.listen(4455, function() {
    console.log("Listening on port 4455");
});