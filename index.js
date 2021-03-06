var express  = require("express");
var parser   = require("body-parser");
var hbs      = require("express-handlebars");
var mongoose = require("./db/connection");
var app      = express();

var Restaurant = mongoose.model("Restaurant");

app.set("port", process.env.PORT || 3001);
app.set("view engine", "hbs");
app.engine(".hbs", hbs({
  extname:        ".hbs",
  partialsDir:    "views/",
  layoutsDir:     "views/",
  defaultLayout:  "layout-main"
}));
app.use("/assets", express.static("public"));
app.use(parser.urlencoded({extended: true}));

app.listen(app.get("port"), function(){
  console.log("It's aliiive!");
});

app.get("/", function(req, res){
  res.render("app-welcome");
});

app.get("/restaurants", function(req, res){
  Restaurant.find({}).then(function(restaurants){
    res.render("restaurants-index", {
      restaurants
    });
  });
});

app.post("/restaurants", function(req, res){
  Restaurant.create(req.body.restaurant).then(function(restaurant){
    res.redirect("/restaurants/" + restaurant.name);
  });
});

app.get("/restaurants/:name", function(req, res){
  Restaurant.findOne({name: req.params.name}).then(function(restaurant){
    res.render("restaurants-show", {
      restaurant
    });
  });
});

app.post("/restaurants/:name/delete", function(req, res){
  Restaurant.findOneAndRemove({name: req.params.name}).then(function(){
    res.redirect("/restaurants")
  });
});

app.post("/restaurants/:name", function(req, res){
  Restaurant.findOneAndUpdate({name: req.params.name}, req.body.restaurant, {new: true}).then(function(restaurant){
    res.redirect("/restaurants/" + restaurant.name);
  });
});
