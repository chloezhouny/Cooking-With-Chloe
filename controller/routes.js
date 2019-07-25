    
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app, db) {



 app.get("/", function(req, res) {
    // res.render("index");
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

  })



app.get("/scrape", function(req, res) {
  axios.get("http://www.gordonramsay.com/gr/recipes/").then(function(response) {

    var $ = cheerio.load(response.data);

 $(".recipe").each(function(i, element) {
    	var result = {};
      console.log($(this));
      var tempUrl = $(this).children().children("a").children().attr("style");
      var index = tempUrl.length;
      result.image = "https://www.gordonramsay.com" + tempUrl.slice(21, index - 2);
      console.log(result.image);

      result.link = "https://www.gordonramsay.com" + $(this).children().children("a").attr("href");

      result.title = $(this).children().children(".summary").children().children("h2").text().toUpperCase();
      result.content = $(this).children().children(".summary").children().children("p").text();
      result.saved = false;
      console.log(result);

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
   res.send("Scrape Complete");
});

});



app.get("/scrapefit", function(req, res) {
  axios.get("https://www.gordonramsay.com/gr/recipes/category/fit-food").then(function(response) {

    var $ = cheerio.load(response.data);

 $(".recipe").each(function(i, element) {
      var result = {};
      console.log($(this));
      var tempUrl = $(this).children().children("a").children().attr("style");
      var index = tempUrl.length;
      result.image = "https://www.gordonramsay.com" + tempUrl.slice(21, index - 2);
      console.log(result.image);

      result.link = "https://www.gordonramsay.com" + $(this).children().children("a").attr("href");

      result.title = $(this).children().children(".summary").children().children("h2").text().toUpperCase();
      result.content = $(this).children().children(".summary").children().children("p").text();
      result.saved = false;
      console.log(result);

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


 app.get('/test', function(req, res){
 	console.log("removing");
 	db.Note.remove({}).then( (dbRecipe) =>
 	{
 		res.json(dbRecipe);
 	});
});

app.get("/saved", function(req, res) {
  // Grab every document in the saved recipes collection
  db.Recipe.find({saved: true})
  .populate("note")
    .then(function(dbRecipe) {

     var hbsObject = {
      recipes: dbRecipe
    };
    console.log(hbsObject);
    res.render("saved", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});



//Update saved
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



//Get new note
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



//Create new note
app.post("/recipes/:id", function(req, res) {

  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Recipe to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Recipe.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbRecipe) {
      console.log(dbRecipe);
      res.json(dbRecipe);
    })
    .catch(function(err) {
      res.json(err);
    });
});




















	}