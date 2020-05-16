// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
const serveStatic = require("serve-static");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express middleware to handle data parsing
// =============================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sets up serve-static middleware for Express to access folders
// =============================================================
const public = path.join(__dirname, "public");
const db = path.join(__dirname, "db");

app.use(serveStatic(public));
app.use(serveStatic(db));

var storedData = [];

// GET Routes
// =============================================================

app.get("/notes", function (req, res) {
  res.sendFile(path.join(public, "notes.html"));
})

app.get("/api/notes", function (req, res) {
 fs.readFile("db/db.json", "utf8", function(err,data){
     var savedData = JSON.parse(data)
     return res.json(savedData)
 })
});

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

    storedData = JSON.parse(data);
    console.log("--------------------");

    storedData.push(newNote);
    
    //Index throug the array a loop to assign/reassign id's 
    for (var i=0; i<storedData.length; i++){
      storedData[i].id = parseInt([i])+1;
    };
    console.log("storedData with new note and id's is: " + storedData);
    console.log("--------------------");

    // Write the new array as the db.json file will overwrite the file
    fs.writeFile( "db/db.json", JSON.stringify(storedData), function (err) {
        if (err) throw err;
        console.log("newNote added to db.json");
        console.log("=====================");
     });
    res.json(true);
  });
});

//DELETE Routes
// =============================================================

app.delete("/api/notes/:id", function(req,res){
  var deleteId = req.params.id;
  console.log("Item to delete is deleteId = "+ deleteId);

  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    storedData = JSON.parse(data);;
    storedData.splice((deleteId-1),1)

    // Assign a new id by indexing through the json object
    for (var i=0; i<storedData.length; i++){
      storedData[i].id = parseInt([i])+1;
    };
    
    fs.writeFile( "db/db.json", JSON.stringify(storedData), function (err) {
      if (err) throw err;
    console.log("Item deleted. db.json updated");
    console.log("=====================");
   });
    res.json(storedData);
})
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
