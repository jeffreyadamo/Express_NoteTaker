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
  newNote.id = 0;
  console.log("newNote now has an id " + newNote);
  console.log("--------------------");

  // Read current db.json, parse its contents into a variable, then push the newNote into the array.
  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    console.log("data from db.json was " + data);
    var storedData =JSON.parse(data);
    newNote.id=(storedData.length+1);
    console.log("newNote has an update id " + newNote)
    storedData.push(newNote);
    console.log("data in " + storedData);

    //Write the new array as the db.json file will overwrite the file
    fs.writeFile( "db/db.json", JSON.stringify(storedData), function (err) {
        if (err) throw err;
      console.log("newNote added to db.json");
     });
    res.json(true)
  });
});

//DELETE Routes
// =============================================================

app.delete("/api/notes/:id", function(req,res){
  var deleteId = req.params.id
  console.log("deleteId = "+ deleteId)
  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    var storedData =JSON.parse(data);
    for (var i=0; i<storedData.length; i++){
      if (deleteId===[i]){
        storedData = storedData.splice(deleteId,1);
        return storedData
      } else{
        console.log("something went wrong in splicing loop")
      }
    }
    
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
