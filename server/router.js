const path = require("path");

//Page listeners
var router = function(app) {
    app.get('/', function(req, res) {
        res.status(200).sendFile(path.join(__dirname + "/../client/html/log-in.html"));
    })

    app.get('/sign-up', function(req, res) {
        res.status(200).sendFile(path.join(__dirname + "/../client/html/sign-up.html"));
    })

    // app.get('/home', function(req, res) {
    //     res.status(200).sendFile(path.join(__dirname + "/../client/html/home-page.html"));
    // })

    app.get('/survey', function(req, res) {
        if (req.session.loggedin) {
            // res.send('Welcome back, ' + req.session.username + '!');
            res.status(200).sendFile(path.join(__dirname + "/../client/html/survey-page.html"));
        } else {
            res.send('Please login to view this page!');
        }
        // res.end();
    });

    /*
    app.get('/meals', function(req, res) {
        if (req.session.loggedin) {
            // res.send('Welcome back, ' + req.session.username + '!');
            res.status(200).sendFile(path.join(__dirname + "/../client/html/meals-page.html"));
        } else {
            res.send('Please login to view this page!');
        }
        // res.end();
    });
    */

    app.get('/workouts', function(req, res) {
        if (req.session.loggedin) {
            // res.send('Welcome back, ' + req.session.username + '!');
            res.status(200).sendFile(path.join(__dirname + "/../client/html/workouts-page.html"));
        } else {
            res.send('Please login to view this page!');
        }
        // res.end();
    });

    app.get('/home', function(req, res) {
        if (req.session.loggedin) {
            // res.send('Welcome back, ' + req.session.username + '!');
            res.status(200).sendFile(path.join(__dirname + "/../client/html/home-page.html"));
        } else {
            res.send('Please login to view this page!');
        }
        // res.end();
    });

    app.get('/admin', function(req, res) {
        if (req.session.loggedin && req.session.admin) {
            // res.send('Welcome back, ' + req.session.username + '!');
            res.status(200).sendFile(path.join(__dirname + "/../client/html/admin-page.html"));
        } else {
            res.send('Must be an admin to view this page!');
        }
        // res.end();
    });

    // app.get('/browse-records', function(req, res) {
    //     res.status(200).sendFile(path.join(__dirname + "/../client/html/read-records.html"));
    // })
};

module.exports = router;