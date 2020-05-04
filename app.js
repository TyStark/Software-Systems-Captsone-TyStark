//jshint esversion:6

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;
const https = require('https');
const makeRequest = require('request');
/*
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//const passportLocal(mysql) = require();
*/

const app = new express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/*
app.use(session({
  secret: 'I am bad at League of Legends.',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));


//app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
*/

var connection = mysql.createConnection({
  host: "us-cdbr-east-06.cleardb.net", //localhost
  user: "bf6ad4e5ad73d5", //esportsadmin
  password: "09620b33", // leave empty
  database: "heroku_23e2dcc4b18babe" //esports
});

/*
  passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true //passback entire req to call back
  } , function (req, username, password, done){
        //if(!username || !password ) { return done(null, false); }
        //var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
        connection.query("SELECT * FROM admin WHERE username = ?", [username], function(err, rows){
            console.log(err); console.log(rows);
          //if (err) return done();
          //if(!rows.length){ return done(null, false, req.flash('message','Invalid username or password.')); }
          //salt = salt+''+password;
          var encPassword = "";
          bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
            encPassword = hash;
          });
          var dbPassword  = rows[0].password;
          //if(!(dbPassword == encPassword)){
              //return done(null, false, req.flash('message','Invalid username or password.'));
           //}
          return done(null, rows[0]);
        });
      }
  ));

passport.serializeUser(function(user, done){
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  connection.query("SELECT * FROM admin WHERE id = "+ id, function (err, rows){
      done(err, rows[0]);
  });
});
*/

//SQL
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

var teams = [];
var registered = [];
var dues = [];
var orders = [];
var clothingType = [];
var clothingColor = ['red', 'black'];
var clothingSize = ['S', 'M', 'L', "XL", "XXL"];
var received = [0, 1];

var sqlTeams = "SELECT * FROM teams;";
connection.query(sqlTeams, function (err, result, fields) {
  if (err) throw err;
  //console.log(result[0].teamName);
  //test = String(result[0].teamName);

  for (var i = 0; i < result.length; i++) {
    //console.log(result[i].teamName);
    teams.push(result[i].teamName);
  }
});

//var sqlRegistered = "SELECT m.firstName, m.lastName, t.teamName FROM members m CROSS JOIN teams t WHERE memberId IN (SELECT memberId FROM registration) AND teamId IN (SELECT teamId FROM registration);";
var sqlRegistered = "SELECT m.firstName, m.lastName, t.teamName FROM registration r JOIN members m ON r.memberId = m.memberId JOIN teams t ON r.teamId = t.teamId;"
connection.query(sqlRegistered, function (err, result, fields) {
  if (err) throw err;
  //console.log(result[0].teamName);
  //test = String(result[0].teamName);

  for (var i = 0; i < result.length; i++) {
    //console.log(result[i].teamName);
    registered.push(result[i]);
    //console.log("ok");
    //console.log(result[i]);
    //console.log(JSON.stringify(result[i]));
    //console.log("hi");
  }
});

var sqlDues = "SELECT m.firstName, m.lastName, d.amountPaid FROM dues d JOIN members m ON d.memberId = m.memberId;"
connection.query(sqlDues, function (err, result, fields) {
  if (err) throw err;
  //console.log(result[0].teamName);
  //test = String(result[0].teamName);

  for (var i = 0; i < result.length; i++) {
    //console.log(result[i].teamName);
    dues.push(result[i]);
    //console.log("ok");
    //console.log(result[i]);
    //console.log(JSON.stringify(result[i]));
    //console.log("hi");
  }
});

var sqlOrders = "SELECT o.orderId, m.firstName, m.lastName, c.clothingType, c.clothingColor, o.clothingSize, o.received FROM clothingOrder o JOIN members m ON o.memberId = m.memberId JOIN clothing c ON o.clothingId = c.clothingId;";
connection.query(sqlOrders, function (err, result, fields) {
  if (err) throw err;
  //console.log(result[0].teamName);
  //test = String(result[0].teamName);

  for (var i = 0; i < result.length; i++) {
    //console.log(result[i].teamName);
    orders.push(result[i]);
    //console.log("ok");
    //console.log(result[i]);
    //console.log(JSON.stringify(result[i]));
    //console.log("hi");
  }
});

var sqlClothingType = "SELECT DISTINCT clothingType FROM clothing;";
connection.query(sqlClothingType, function (err, result, fields) {
  if (err) throw err;
  //console.log(result[0].teamName);
  //test = String(result[0].teamName);

  for (var i = 0; i < result.length; i++) {
    //console.log(result[i].teamName);
    clothingType.push(result[i]);
    //console.log("ok");
    //console.log(result[i]);
    //console.log(JSON.stringify(result[i]));
    //console.log("hi");
  }
});

/* COMMENTED B/C currently linked to order and not clothing
var sqlClothingSize = "SELECT clothingSize FROM clothing;";
connection.query(sqlClothingSize, function(err,result,fields){
  if (err) throw err;
  //console.log(result[0].teamName);
  //test = String(result[0].teamName);

  for(var i=0; i<result.length; i++)
  {
    //console.log(result[i].teamName);
    clothingSize.push(result[i]);
    //console.log("ok");
    //console.log(result[i]);
    //console.log(JSON.stringify(result[i]));
    //console.log("hi");
  }
});
*/

/*
var sqlReceived = "SELECT received FROM clothingOrder;";
connection.query(sqlReceived, function(err,result,fields){
  if (err) throw err;
  //console.log(result[0].teamName);
  //test = String(result[0].teamName);

  for(var i=0; i<result.length; i++)
  {
    //console.log(result[i].teamName);
    received.push(result[i]);
    //console.log("ok");
    //console.log(result[i]);
    //console.log(JSON.stringify(result[i]));
    //console.log("hi");
  }
});
*/

// GET
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

app.get('/', function (request, response) {
  response.render(__dirname + '/views/pages/index');
});

app.get('/competitive', function (request, response) {
  response.render(__dirname + '/views/pages/competitive', { teams: teams, registered: registered });
});

app.get('/contact', function (request, response) {
  response.render(__dirname + '/views/pages/contact');
});

app.get('/clothingorder', function (request, response) {
  response.render(__dirname + '/views/pages/clothingorder');
});

app.get('/login', function (request, response) {
  response.render(__dirname + '/views/pages/login');
});

app.get('/admin', function (request, response) {
  response.render(__dirname + '/views/pages/admin');
});

/*
app.get('/registration', function(request,response){
    response.render(__dirname + '/views/pages/registration', {teams: teams, registered: registered});
});

app.get('/dues', function(request,response){
    response.render(__dirname + '/views/pages/dues', {dues: dues});
});

app.get('/manageorders', function(request,response){
    response.render(__dirname + '/views/pages/manageorders', {orders: orders, clothingType: clothingType, clothingColor: clothingColor, clothingSize: clothingSize, received: received});
});

app.get('/teams', function(request,response){
    response.render(__dirname + '/views/pages/teams', {teams: teams});

});

app.get('/admin', function(request,response){
  /*
  if(request.isAuthenticated()){
    response.render(__dirname + '/views/pages/admin');
  }else {
    response.redirect("/login");
  }
  *
 //response.render(__dirname + '/views/pages/admin');
 console.log("not allowed");
});
*/

// POST
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

app.post('/memberregister', function (request, response) {
var first = request.body.first;
var last = request.body.last;
var registeremail = request.body.registeremail;
console.log("" + first + " " + last);

memberRegisterSQL = "INSERT INTO members (firstName, lastName, email) VALUES ('"+ first + "', '" + last + "', '" + registeremail + "');";
console.log(memberRegisterSQL);
connection.query(memberRegisterSQL, function (err, result) {
  if (err) throw err;
  response.redirect("/");
});

});

app.post('/newsletter', function (request, response) {
  //459c5962c2
  //4938bd6f3193745c1930c926cf6d601a-us4
  var newsfirst = request.body.newsfirst;
  var newslast = request.body.newslast;
  var email = request.body.email;
  console.log(email);

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: newsfirst,
          LNAME: newslast
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/459c5962c2",
    method: "POST",
    headers: {
      "Authorization": "LewisEsports 4938bd6f3193745c1930c926cf6d601a-us4"
    },
    body: jsonData
  };
  makeRequest(options, function(error,res,body){
    response.redirect("/");
  });

});

app.post('/clothingorder', function (request, response) {
  var firstName = request.body.firstName;
  var lastName = request.body.lastName;
  var clothingType = request.body.clothingType;
  var clothingColor = request.body.clothingColor;
  var clothingSize = request.body.clothingSize;

  //console.log(firstName);
  //console.log(lastName);
  //console.log(clothingType);
  //console.log(clothingColor);
  //console.log(clothingSize);

  var testSelectionSQL = "SELECT firstName, lastName FROM members WHERE firstname = '" + firstName + "' AND lastName = '" + lastName + "'";
  connection.query(testSelectionSQL, function (err, result) {
    if (err) throw err;
    
    if(result.length == 0){

    }
    else {
      var selectionToSQL = "INSERT INTO clothingOrder (memberId, clothingId, clothingSize) VALUES ((SELECT memberID FROM members WHERE firstname = '" + firstName + "' AND lastName = '" + lastName + "'), (SELECT clothingId FROM clothing WHERE clothingType = '" + clothingType + "' AND clothingColor = '" + clothingColor + "'), '" + clothingSize + "');"
      connection.query(selectionToSQL, function (err, result) {
        if (err) throw err;
      });
    }
  });

//  var selectionToSQL = "INSERT INTO clothingOrder (memberId, clothingId, clothingSize) VALUES ((SELECT memberID FROM members WHERE firstname = '" + firstName + "' AND lastName = '" + lastName + "'), (SELECT clothingId FROM clothing WHERE clothingType = '" + clothingType + "' AND clothingColor = '" + clothingColor + "'), '" + clothingSize + "');"
//  connection.query(selectionToSQL, function (err, result) {
//    if (err) throw err;
//  });

  response.render(__dirname + '/views/pages/clothingorder');
});

app.post('/addteam', function (request, response) {
  var newTeam = request.body.newTeam;

  teams.push(newTeam);
  //console.log(newTeam);
  //response.render(__dirname + '/views/pages/teams', {teams: teams});

  var sqlAddTeam = "INSERT INTO teams (teamName) VALUES ('" + newTeam + "');";
  //console.log(sqlAddTeam);
  connection.query(sqlAddTeam, function (err, result) {
    if (err) throw err;
    response.redirect("/teams");
    //console.log("hi");
  });
  //response.redirect("/teams");
});

app.post('/registerplayer', function (request, response) {
  var firstName = request.body.firstName;
  var lastName = request.body.lastName;
  var teamName = request.body.teamName;

  var registeredPlayerString = '{"firstName":  "' + firstName + '" ,"lastName":  "' + lastName + '" ,"teamName":  "' + teamName + '" }';
  //console.log("lololol");
  //console.log(registeredPlayerString);
  var registeredplayer = JSON.parse(registeredPlayerString)

  registered.push(registeredplayer);
  //console.log(newTeam);
  //response.render(__dirname + '/views/pages/teams', {teams: teams});

  var sqlAddTeam = "INSERT INTO registration (memberId, teamId, registrationStatus) VALUES ((SELECT memberId FROM members WHERE firstname = '" + firstName + "' AND lastName = '" + lastName + "'), (SELECT teamId FROM teams WHERE teamName = '" + teamName + "'), 'active');";
  //console.log(sqlAddTeam);
  connection.query(sqlAddTeam, function (err, result) {
    if (err) throw err;
    response.redirect("/registration");
    //console.log("hi");
  });

  //response.redirect("/registration");
});

app.post('/documentdue', function (request, response) {
  var firstName = request.body.firstName;
  var lastName = request.body.lastName;
  var amount = request.body.amount;

  var newDueString = '{"firstName":  "' + firstName + '" ,"lastName":  "' + lastName + '" ,"amountPaid":  "' + amount + '" }';
  //console.log("lololol");
  //console.log(newDueString);
  var newDue = JSON.parse(newDueString)

  dues.push(newDue);
  //console.log(newTeam);
  //response.render(__dirname + '/views/pages/teams', {teams: teams});

  var sqlAddTeam = "INSERT INTO dues (memberId, amountPaid) VALUES ((SELECT memberId FROM members WHERE firstname = '" + firstName + "' AND lastName = '" + lastName + "'), " + amount + ");";
  //console.log(sqlAddTeam);
  connection.query(sqlAddTeam, function (err, result) {
    if (err) throw err;
    response.redirect("/dues");
    //console.log("hi");
  });

  //response.redirect("/registration");
});

app.post('/changeorder', function (request, response) {
  var orderId = request.body.orderId;
  var firstName = request.body.firstName;
  var lastName = request.body.lastName;
  var type = request.body.clothingType;
  var color = request.body.clothingColor;
  var size = request.body.clothingSize;
  var isReceived = request.body.received;

  //console.log(firstName);
  //console.log(lastName);
  //console.log(type);
  //console.log(color);
  //console.log(size);
  //console.log(isReceived);


  var editedOrderString = '{"orderId": "' + orderId + '", "firstName":  "' + firstName + '" , "lastName":  "' + lastName + '" , "clothingType": "' + type + '", "clothingColor": "' + color + '", "clothingSize": "' + size + '", "received": ' + isReceived + '}';
  //console.log("lololol");
  //console.log(newDueString);
  var editedOrder = JSON.parse(editedOrderString)

  // FIND INDEX OF ORDER TO ALTER IT
  //console.log(orders)
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].orderId == orderId)
      orders.splice(i, 1);
    //console.log(orders);
  }

  orders.push(editedOrder);
  //console.log(orders);
  //console.log(orders.findIndex("Tyler"));
  //console.log();
  //console.log(newTeam);
  //response.render(__dirname + '/views/pages/teams', {teams: teams});

  var sqlChangeOrder = "UPDATE clothingOrder SET clothingId = (SELECT clothingId FROM clothing WHERE clothingType = '" + type + "' AND clothingColor = '" + color + "'), clothingSize = '" + size + "', received = '" + isReceived + "' WHERE orderId = '" + orderId + "';";
  //console.log(sqlChangeOrder);
  connection.query(sqlChangeOrder, function (err, result) {
    if (err) throw err;
    response.redirect("/manageorders");
    //console.log("hi");
  });

  //response.redirect("/manageorders");
});

app.post('/checklogin', function (request, response) {
  var userName = request.body.userName;
  var userPassword = request.body.password;
  var redirectPage = request.body.redirectPage;
  console.log(redirectPage);

  var hashedPassword = "";

  var sqlFetchHashedPassword = "SELECT userPassword FROM admin WHERE userName = '" + userName + "';";
  connection.query(sqlFetchHashedPassword, function (err, result) {
    if (err) throw err;
    hashedPassword = result[0].userPassword;
    //console.log(hashedPassword);

    bcrypt.compare(userPassword, hashedPassword, function (err, bcryptResult) {
      // result == true
      if (bcryptResult == true) {
        console.log("successful login");
        if (redirectPage == "Dues") {
          response.render(__dirname + '/views/pages/dues', { dues: dues });
        }
        if (redirectPage == "ManageOrders") {
          response.render(__dirname + '/views/pages/manageorders', { orders: orders, clothingType: clothingType, clothingColor: clothingColor, clothingSize: clothingSize, received: received });
        }
        if (redirectPage == "Registration") {
          response.render(__dirname + '/views/pages/registration', { teams: teams, registered: registered });
        }
        if (redirectPage == "Teams") {
          response.render(__dirname + '/views/pages/teams', { teams: teams });
        }
        //passport.authenticate("local");
        //response.redirect("/admin");
        //response.render(__dirname + '/views/pages/admin');
      } else {
        console.log("Wrong password");
      }
    });

    //response.redirect("/admin");
  });

  //response.redirect("/admin");

});

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//Quickly create an admin to test
app.get('/createadmin', function (request, response) {
  salt = "idk";
  bcrypt.genSalt(saltRounds, function(e,r){
    salt = r;
  });
  bcrypt.hash("lewisesports", salt, null, function (err, hash) {
    console.log(err);
    // Store hash in your password DB.
    console.log(hash)
    var sqlAddAdmin = "INSERT INTO admin (userName, userPassword) VALUES ('admin', '" + hash + "');";
    connection.query(sqlAddAdmin, function (err, result) {
      if (err) throw err;
      response.render(__dirname + '/views/pages/admin');
      //response.redirect("/admin");
      //console.log("hi");
    });
  });
});
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Server running on port 3000");
});
