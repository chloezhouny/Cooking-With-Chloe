var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");


// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");
db.Recipe.remove({});
var PORT = process.env.PORT || 8080;


// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// Connect to the Mongo DB
// Mongo remote/local initialization
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(() => console.log("Connected to db")).catch((err) => console.log(err));

// mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


require("./controller/routes.js")(app, db);
 


app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});



