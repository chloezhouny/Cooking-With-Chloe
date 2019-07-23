var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");


// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 8080;


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


// Routes
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.gordonramsay.com/gr/recipes/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".summary").each(function(i, element) {
      // Save an empty result object
      var result = {};
      console.log($(this));

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children().children("h2")
        .text();
      result.link = "https://www.gordonramsay.com" + $(this)
        .children("a")
        .attr("href");
      result.content = $(this).children().children("p").text();
      result.saved = false;
      console.log(result);

      // Create a new recipe using the `result` object built from scraping
      db.Recipe.create(result)
        .then(function(dbRecipe) {
          // View the added result in the console
          console.log(dbRecipe);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});





app.get("/recipes", function(req, res) {
  // Grab every document in the Recipes collection
  db.Recipe.find({})

    .then(function(dbRecipe) {

     var hbsObject = {
      recipes: dbRecipe
    };
    console.log(hbsObject);
    res.render("index", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});



app.put("/recipes/:id", function(req,res){
  db.Recipe.findOneAndUpdate({ _id: req.params.id }, req.body)
  .then(function(response){
    res.json(true)
    console.log(response);
  })
  .catch(function(err){
    console.log(err);
  })
})




app.get("/recipes/:id", function(req, res) {
  db.Recipe.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbRecipe) {
      res.json(dbRecipe);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/recipes/:id", function(req, res) {

  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Recipe to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Recipe.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbRecipe) {
      res.json(dbRecipe);
    })
    .catch(function(err) {
      res.json(err);
    });
});


app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});



