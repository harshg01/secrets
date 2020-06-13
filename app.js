//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



mongoose.connect('mongodb://localhost:27017/secrets', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err))


  const usersSchema = new mongoose.Schema({
    email: String,
    password: String
  });


  usersSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"]});


  const User = mongoose.model("User", usersSchema);





  app.route("/register")
    .get(function(req, res) {
      res.render('register');
    })
    .post(function(req, res) {
      const user = new User({
        email: req.body.username,
        password: req.body.password
      });

      user.save(function(err) {
        if (!err) {
          res.render('secrets');

        } else {
          console.log(err);
        }
      })
    });



    app.route("/login")
      .get(function(req, res) {
        res.render('login')
      })
      .post(function(req, res) {
       User.findOne({email:req.body.username},function(err,foundUser){
         if(foundUser){
          if (foundUser.password === req.body.password) {
            res.render('secrets');
          } else {
            res.send("Your Password dont Match");
          }

         } else {
           if (err) {
             console.log(err);
           } else {
             res.send("No user found")
           }
         }
       });
       });




app.get("/", function(req,res){
  res.render('home')
});

app.get("/login", function(req,res){
  res.render('login')
});


app.get("/submit", function(req,res){
  res.render('submit')
});






let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
