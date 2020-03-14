//jshint esversion:6

const express = require('express');
const ejs = require("ejs");
const bodyParser = require("body-parser");
var mysql = require('mysql');

const app = new express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "esports"
  });

//SQL
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

var teams = [];
var registered = [];
var dues = [];

var sqlTeams = "SELECT * FROM teams;";
connection.query(sqlTeams, function(err,result,fields){
  if (err) throw err;
  //console.log(result[0].teamName);
  //test = String(result[0].teamName);

  for(var i=0; i<result.length; i++)
  {
    //console.log(result[i].teamName);
    teams.push(result[i].teamName);
  }
});

//var sqlRegistered = "SELECT m.firstName, m.lastName, t.teamName FROM members m CROSS JOIN teams t WHERE memberId IN (SELECT memberId FROM registration) AND teamId IN (SELECT teamId FROM registration);";
var sqlRegistered = "SELECT m.firstName, m.lastName, t.teamName FROM registration r JOIN members m ON r.memberId = m.memberId JOIN teams t ON r.teamId = t.teamId;"
connection.query(sqlRegistered, function(err,result,fields){
  if (err) throw err;
  //console.log(result[0].teamName);
  //test = String(result[0].teamName);

  for(var i=0; i<result.length; i++)
  {
    //console.log(result[i].teamName);
    registered.push(result[i]);
    //console.log("ok");
    //console.log(result[i]);
    //console.log(JSON.stringify(result[i]));
    //console.log("hi");
  }
});

var sqlDues = "SELECT m.firstName, m.lastName, d.amountPaid FROM dues d JOIN members m ON d.memberId = m.memberId;"
connection.query(sqlDues, function(err,result,fields){
  if (err) throw err;
  //console.log(result[0].teamName);
  //test = String(result[0].teamName);

  for(var i=0; i<result.length; i++)
  {
    //console.log(result[i].teamName);
    dues.push(result[i]);
    //console.log("ok");
    //console.log(result[i]);
    //console.log(JSON.stringify(result[i]));
    //console.log("hi");
  }
});

// GET
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

app.get('/', function(request,response){
    response.render(__dirname + '/views/pages/index');
});

app.get('/competitive', function(request,response){
    response.render(__dirname + '/views/pages/competitive');
});

app.get('/contact', function(request,response){
    response.render(__dirname + '/views/pages/contact');
});

app.get('/clothingorder', function(request,response){
    response.render(__dirname + '/views/pages/clothingorder');
});

app.get('/login', function(request,response){
    response.render(__dirname + '/views/pages/login');
});

app.get('/registration', function(request,response){
    response.render(__dirname + '/views/pages/registration', {teams: teams, registered: registered});
});

app.get('/dues', function(request,response){
    response.render(__dirname + '/views/pages/dues', {dues: dues});
});

app.get('/manageorders', function(request,response){
    response.render(__dirname + '/views/pages/manageorders');
});

app.get('/teams', function(request,response){
    response.render(__dirname + '/views/pages/teams', {teams: teams});

});

app.get('/admin', function(request,response){
    response.render(__dirname + '/views/pages/admin');
});

// POST
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

app.post('/clothingorder', function(request,response){
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

    var selectionToSQL = "INSERT INTO clothingOrder (memberId, clothingId, clothingSize) VALUES ((SELECT memberID FROM members WHERE firstname = '" + firstName + "' AND lastName = '" + lastName + "'), (SELECT clothingId FROM clothing WHERE clothingType = '" + clothingType + "' AND clothingColor = '" + clothingColor + "'), '" + clothingSize + "');"
    connection.query(selectionToSQL, function(err,result){
        if (err) throw err;
    });

    response.render(__dirname + '/views/pages/clothingorder');
});

app.post('/addteam', function(request,response){
    var newTeam = request.body.newTeam;

    teams.push(newTeam);
    //console.log(newTeam);
    //response.render(__dirname + '/views/pages/teams', {teams: teams});

    var sqlAddTeam = "INSERT INTO teams (teamName) VALUES ('" + newTeam + "');";
    //console.log(sqlAddTeam);
    connection.query(sqlAddTeam, function(err,result){
      if (err) throw err;
      response.redirect("/teams");
      //console.log("hi");
    });
    //response.redirect("/teams");
});

app.post('/registerplayer', function(request,response){
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;
    var teamName = request.body.teamName;

    var registeredPlayerString = '{"firstName":  "'+ firstName +'" ,"lastName":  "'+ lastName +'" ,"teamName":  "'+ teamName +'" }';
    //console.log("lololol");
    //console.log(registeredPlayerString);
    var registeredplayer = JSON.parse(registeredPlayerString)

    registered.push(registeredplayer);
    //console.log(newTeam);
    //response.render(__dirname + '/views/pages/teams', {teams: teams});

    var sqlAddTeam = "INSERT INTO registration (memberId, teamId, registrationStatus) VALUES ((SELECT memberId FROM members WHERE firstname = '" + firstName + "' AND lastName = '" + lastName + "'), (SELECT teamId FROM teams WHERE teamName = '" + teamName + "'), 'active');";
    //console.log(sqlAddTeam);
    connection.query(sqlAddTeam, function(err,result){
      if (err) throw err;
      response.redirect("/registration");
      //console.log("hi");
    });

    //response.redirect("/registration");
});

app.post('/documentdue', function(request,response){
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;
    var amount = request.body.amount;

    var newDueString = '{"firstName":  "'+ firstName +'" ,"lastName":  "'+ lastName +'" ,"amountPaid":  "'+ amount +'" }';
    //console.log("lololol");
    //console.log(newDueString);
    var newDue = JSON.parse(newDueString)

    dues.push(newDue);
    //console.log(newTeam);
    //response.render(__dirname + '/views/pages/teams', {teams: teams});

    var sqlAddTeam = "INSERT INTO dues (memberId, amountPaid) VALUES ((SELECT memberId FROM members WHERE firstname = '" + firstName + "' AND lastName = '" + lastName + "'), " + amount + ");";
    //console.log(sqlAddTeam);
    connection.query(sqlAddTeam, function(err,result){
      if (err) throw err;
      response.redirect("/dues");
      //console.log("hi");
    });

    //response.redirect("/registration");
});

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

var server = app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
});
