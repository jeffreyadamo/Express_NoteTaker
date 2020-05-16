// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
var serveStatic = require("serve-static");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sets up serve-static middleware for Express to access folders
// =============================================================
var public = path.join(__dirname, "public");
var db = path.join(__dirname, "db");

app.use(serveStatic(public));
app.use(serveStatic(db));

// Sets up the array the notes will be pushed into as JSON objects
var notes = [];

// GET Routes
// =============================================================

app.get("/notes", function (req, res) {
  res.sendFile(path.join(public, "notes.html"));

})

app.get("/api/notes", function (req, res) {
 fs.readFile("db/db.json", "utf8",function(err,data){
     var savedData=JSON.parse(data)
     return res.json(savedData)
 })

});
//the '*' indicates anything other path will return with index.html
app.get("*", function (req, res) {
  res.sendFile(path.join(public, "index.html"));
});
// POST Routes
// =============================================================

app.post("/api/notes", function (req, res) {
  // Turn the posted object into a variable
  var newNote = req.body;
  console.log("newNote comes in as " + newNote);
  console.log("newNote comes can be read as " + JSON.stringify(newNote));
  console.log("--------------------");

  // Read current db.json, parse its contents into a variable, then push the newNote into the array.
  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    console.log("data from db.json come in as: " + data);

    var storedData =JSON.parse(data);
    console.log("--------------------");

    storedData.push(newNote);
        //Here's where I need to run a loop to assign/reassign id's
        for (var i=0; i<storedData.length; i++){
          storedData[i].id = parseInt([i])+1;
        };
    console.log("storedData with new note and id's is: " + storedData);
    console.log("--------------------");

    // Write the new array as the db.json file will overwrite the file
    fs.writeFile( "db/db.json", JSON.stringify(storedData), function (err) {
        if (err) throw err;
        console.log("newNote added to db.json");
        console.log("--------------------");
        console.log("--------------------");
     });
    res.json(true);
  });
});

//DELETE Routes
// =============================================================

app.delete("/api/notes/:id", function(req,res){
  var deleteId = req.params.id
  console.log("=====================");
  console.log("Item to delete is deleteId = "+ deleteId)
  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    // var storedData =JSON.parse(data);
    var storedData =JSON.parse(data);
    storedData.splice((deleteId-1),1)
    for (var i=0; i<storedData.length; i++){
      storedData[i].id = parseInt([i])+1;
    };

    
    fs.writeFile( "db/db.json", JSON.stringify(storedData), function (err) {
      if (err) throw err;
    console.log("Something was spliced");
   });


    //readFile
    // find the index of what you need to delete and use smtng like splice (index,1)
    res.json(storedData);
})
});
// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
