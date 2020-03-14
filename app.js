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

var teams = [];

var sqlTeams = "SELECT * FROM team;";
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
    response.render(__dirname + '/views/pages/registration');
});

app.get('/dues', function(request,response){
    response.render(__dirname + '/views/pages/dues');
});

app.get('/manageorders', function(request,response){
    response.render(__dirname + '/views/pages/manageorders');
});

app.get('/teams', function(request,response){
    response.render(__dirname + '/views/pages/teams', {teams: teams});

});

app.post('/addteam', function(request,response){
    var newTeam = request.body.newTeam;

    teams.push(newTeam);
    //console.log(newTeam);
    //response.render(__dirname + '/views/pages/teams', {teams: teams});

    var sqlAddTeam = "INSERT INTO team (teamName) VALUES ('" + newTeam + "');";
    //console.log(sqlAddTeam);
    connection.query(sqlAddTeam, function(err,result){
      if (err) throw err;
      response.redirect("/teams");
      //console.log("hi");
    });
    //response.redirect("/teams");
});

app.get('/admin', function(request,response){
    response.render(__dirname + '/views/pages/admin');
});

// POST

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

var server = app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
});
