const mysql = require('mysql2');
// var mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'fitness'
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL!');
  });

let currentUser;
  

var services_sql = function(app) {

  app.post('/auth', function(req, res) {
    // console.log(req.body);
    // console.log(res);
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(err, results, fields) {
            if (err) throw err;
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                currentUser = results[0].user_id;
                console.log(currentUser);
                if(results[0].admin == 1){
                    req.session.admin = true;
                }
                res.redirect('/home');
            } else {
                res.send('Incorrect Username and/or Password!');
            }			
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});

app.post('/sign-up', function(req, res) {
  // console.log(req.body);
    // console.log(res);
    let username = req.body.username;
    let password = req.body.password;
    currentUser= req.body.user_id;
    if (username && password) {
        connection.query('SELECT * FROM users WHERE username = ?', [username], function(err, results, fields) {
            if (err) throw err;
            if (results.length != 0 && results[0].password == password) {
              req.session.loggedin = true;
              req.session.username = username;
              currentUser = results[0].user_id;
              console.log(currentUser);
              if(results[0].admin == 1){
                req.session.admin = true;
              }
              res.redirect('/home');
            } else if (results != 0 && results[0].password != password){
              res.send("User already exists") 
            
              // console.log("password: ", password);
              // console.log("user password: ", results[0].password);
              // console.log("------> User already exists")
              // console.log(results);
            } else {
              connection.query ('INSERT INTO users (username, password) VALUES (?,?)', [username, password], function(err, results, fields) {
                if (err) throw (err)
                req.session.loggedin = true;
                req.session.username = username;
                connection.query('SELECT user_id FROM users WHERE username = ?', [username], function(err, results, fields) {
                    if (err) throw (err)
                    currentUser = results[0].user_id;
                    console.log(currentUser);
                })
                res.redirect('/home');
              })            }			
      });
  } else {
      res.send('Please enter Username and Password!');
  }
});

/*
app.post('/auth', function(req, res) {
  // console.log(req.body);
  // console.log(res);
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
      connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(err, results, fields) {
          if (err) throw err;
          if (results.length > 0) {
              req.session.loggedin = true;
              req.session.username = username;
              res.redirect('/home');
          } else {
              res.send('Incorrect Username and/or Password!');
          }			
          res.end();
      });
  } else {
      res.send('Please enter Username and Password!');
      res.end();
  }
});*/

app.get('/sign-up', function(req, res) {
    res.status(200).sendFile(path.join(__dirname + "/../client/html/sign-up.html"));
})

app.get('/home', function(req, res) {
    if (req.session.loggedin) {
        res.send('Welcome back, ' + req.session.username + '!');
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
});


// app.get('/workouts', function(req, res) {
//   if (req.session.loggedin) {
//       res.send('Welcome back, ' + req.session.username + '!');
//   } else {
//       res.send('Please login to view this page!');
//   }
//   res.end();
// });


    app.post('/write-record-mysql', function(req, res) {
        console.log('In MySQL Write Record');

        var data = {
            bookTitle: req.body.bookTitle, 
            author: req.body.author, 
            publisher: req.body.publisher, 
            yearPublished: req.body.yearPublished, 
            isbn: req.body.isbn
        };

          connection.query("INSERT INTO books SET ?", data, function(err, results) {
              if(err) {
                  throw err;
              } else {
                console.log("Inserted new record");
                // connection.end();
                return res.status(201).send(JSON.stringify({msg:"SUCCESS"}));
              }
          });
          
    });

    app.get('/read-workouts', function(req, res) {
          console.log("user " + currentUser);
          connection.query(`
            SELECT workout_plan.workout_plan_id, exercises.exercise_name
            FROM users
	        JOIN workout_plan
		        ON workout_plan.routine = users.routine
            JOIN exercise_plan_workouts
		        ON workout_plan.workout_plan_id = exercise_plan_workouts.workout_plan_id
	        JOIN exercises
		        ON exercises.exercise_id = exercise_plan_workouts.exercise_id
            WHERE user_id = ?`, currentUser
            , function(err, rows) {
              if(err) {
                  throw err;
              } else {
                console.log("Read Records");
                // connection.end();
                return res.status(201).send(JSON.stringify({msg:"SUCCESS", exercises:rows}));
              }
          });    
    });

    /*app.get('/read-records', function(req, res) {
        connection.query("SELECT * FROM exercises", function(err, rows) {
            if(err) {
                throw err;
            } else {
              console.log("Read Records");
              // connection.end();
              return res.status(201).send(JSON.stringify({msg:"SUCCESS", exercises:rows}));
            }
        });    
  });*/


}

module.exports = services_sql;