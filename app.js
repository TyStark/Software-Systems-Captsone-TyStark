//jshint esversion:6

const express = require('express');

const app = new express();

app.use(express.static("public"));

app.get('/', function(request,response){
    response.sendFile(__dirname + '/html/index.html');
});

app.get('/competitive', function(request,response){
    response.sendFile(__dirname + '/html/competitive.html');
});

app.get('/contact', function(request,response){
    response.sendFile(__dirname + '/html/contact.html');
});

app.get('/clothingorder', function(request,response){
    response.sendFile(__dirname + '/html/clothingorder.html');
});

app.get('/login', function(request,response){
    response.sendFile(__dirname + '/html/login.html');
});

app.get('/registration', function(request,response){
    response.sendFile(__dirname + '/html/registration.html');
});

app.get('/dues', function(request,response){
    response.sendFile(__dirname + '/html/dues.html');
});

app.get('/admin', function(request,response){
    response.sendFile(__dirname + '/html/admin.html');
});

var server = app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
});
