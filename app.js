
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to my site! Here I will try to upload all of my completed projects, as well as keep an updated version of my resume. The goal is to make this site an all-in-one web address to allow for quick and easy access to my programming trials and accomplishments, so that I can give potential employers a concise snapshot of my progress and skills.";
const aboutContent = "I am a self-taught full stack web developer, after beginning the learning process in June of 2020. Before that, I had worked my way from Field Chemist up to the Operations Manager of Tradebe Environmental's fledgling New Jersey branch in just shy of 2 years. There I learned not only to work with a team, but also to balance problems with expectations, putting my company and their customers above all else. Like so many others, I lost my job around the time of the Covid outbreak, which jumpstarted my path to learning coding. With my Bachelor's in Physics from Rutgers University, I have gained a diverse background of mathematics, science, and problem-solving abilities throughout the years. ";
const aboutContent2 = "I am currently fluent in HTML, CSS, Javascript, jQuery, Express, PHP, node.js, react.js, mySQL, and MongoDB. I am constantly learning new techniques and trying new languages in hopes to broaden my programming horizons. Front and back end web development are both within my scope if needed, and I am always up to the task of learning more. I love working with others, and will always offer my help if I can. Likewise, I am not afraid to ask for help when I need it, as I highly value working together with a team to make something greater than it's constituent parts.";
const contactContent = "The best way to contact me is through my email, which is shown below and also included on my resume (resume can be found in the 'About Me' section). My resume includes my cell phone number, also shown below. Thank you for viewing my page, and have a nice day!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://vmattz:' + process.env.PASSWORD + '@cluster0.k41nf.mongodb.net/portfoliodb', {useNewUrlParser: true});

console.log(process.env.PASSWORD);

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);

//Getting the home route and allowing the starting info to be posted, as well as any update posts I may make
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
    })

});

//The 'about' and 'contact' routes are static and won't really be changed, so their route is easy enough
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent, aboutContent2: aboutContent2});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

//The 'compose' route is for if/when I decide to write any update posts, allowing the site to be somewhat like a blog if I wanted
app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })
  
  post.save(function(err){
    if (!err){
      res.redirect('/');
    }
  });
});

//This utilizes Mongoose to grab any posts that I make and then update the page with the new posts.
app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;

  Post.findOne({_id: requestedId}, function(err, post){
    res.render('post',{
      title: post.title,
      content: post.content
    });
  });
});




app.listen(process.env.PORT || 3000, function() {
  console.log("Server started");
});
