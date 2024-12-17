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
                else{
                  req.session.admin = false
                }
                res.redirect('/home');
            } else {
                res.redirect('/');
            }			
            res.end();
        });
    } else {
        res.redirect('/');
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
              else{
                req.session.admin = false
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

    app.post('/questionnaire', function(req, res) {

        var data = {
            experience: req.body.experience, 
            exp_explained: req.body.experience_explained, 
            goals_explained: req.body.goals_explained, 
            goals: req.body.goal, 
            comfort: req.body.comfort,
            injuries: req.body.injuries,
            meal_interest: req.body.meals
        };
        
        connection.query("INSERT INTO survey SET ?", data, function(err, results) {
            if(err) {
                throw err;
            } else {
              console.log("Inserted new record");
              console.log(results.insertId);
              connection.query('UPDATE users SET survey_id = ? WHERE user_id = ?', [results.insertId, currentUser], function(err, results, fields) {
                    if (err) throw (err)
                    console.log("Update user to survey id");
                })
              // connection.end();
              res.redirect('/home');
            }
        });

    });

    app.get('/read-workouts', function(req, res) {
          console.log("user " + currentUser);
          connection.query(`
            SELECT exercises.exercise_id, workout_plan.workout_plan_id, exercises.exercise_name, exercises.description, exercises.reps
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

    app.get('/read-surveys', function(req, res) {
      console.log("user " + currentUser);
      connection.query(`
        SELECT survey.survey_id, experience, exp_explained, goals_explained, goals, comfort, injuries, meal_interest, user_id, username
        FROM survey
          JOIN users
            ON users.survey_id = survey.survey_id`
        , function(err, rows) {
            if(err) {
              throw err;
            } else {
              console.log("Read Records");
              // connection.end();
              return res.status(201).send(JSON.stringify({msg:"SUCCESS", surveys:rows}));
            }
          });    
    });

    app.get('/read-workout-plans', function(req, res) {
      console.log("user " + currentUser);
      connection.query(`
        SELECT *
        FROM workout_plan
	        JOIN exercise_plan_workouts
		        ON exercise_plan_workouts.workout_plan_id = workout_plan.workout_plan_id
	        JOIN exercises
		        ON exercises.exercise_id = exercise_plan_workouts.exercise_id
        ;`
        , function(err, rows) {
            if(err) {
              throw err;
            } else {
              console.log("Read Records");
              // connection.end();
              return res.status(201).send(JSON.stringify({msg:"SUCCESS", plans:rows}));
            }
          });    
    });

    app.post('/assign-workout-plan', function(req, res) {

      console.log("req");
      console.log(req.body.data_id);
      console.log(req.body.routine_value);
      // console.log("res");
      // console.log(res);
      
      // connection.query('SELECT * FROM users WHERE user_id = ?', [req.body.data_id], function(err, results, fields) {      
      connection.query('UPDATE users SET routine = ? WHERE user_id = ?', [req.body.routine_value, req.body.data_id], function(err, results, fields) {
          if(err) {
              throw err;
          } else {
            console.log("Updated workout plan");
            console.log(results);
            // connection.end();
            // res.redirect('/home');
          }
      });

  });

  app.get('/logout', function(req, res) {
    console.log(req.session.loggedin)
    // res.redirect('/')
    req.session.admin = false;
    req.session.loggedin = false;
    console.log(req.session.loggedin)
    res.end();
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