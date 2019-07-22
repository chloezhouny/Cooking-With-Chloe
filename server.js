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
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });


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
      result.link = $(this)
        .children("a")
        .attr("href");
      result.content = $(this).children().children("p").text();


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

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
