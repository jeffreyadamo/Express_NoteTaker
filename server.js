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

  // Read current db.json, parse its contents into a storedData array; push the newNote into the array
  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    storedData = JSON.parse(data);
    storedData.push(newNote);
    console.log("newNote added to db.json");

    // Index through the storedData array to assign/reassign id's 
    for (var i=0; i<storedData.length; i++){
      storedData[i].id = parseInt([i])+1;
    };

    // Overwrite the db.json file with newNote included
    fs.writeFile( "db/db.json", JSON.stringify(storedData), function (err) {
        if (err) throw err;
        console.log("db.json updated");    
        console.log("---------------------------------------------------");    
     });
    res.json(true);
  });
});

// DELETE Routes
// =============================================================
app.delete("/api/notes/:id", function(req,res){
  var deleteId = req.params.id;

  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    storedData = JSON.parse(data);;
    storedData.splice((deleteId-1),1)
    console.log("Note " + deleteId + " deleted");
    // Index through the storedData array reassign id's in order
    for (var i=0; i<storedData.length; i++){
      storedData[i].id = parseInt([i])+1;
    };
    
    fs.writeFile( "db/db.json", JSON.stringify(storedData), function (err) {
      if (err) throw err;
    
    console.log("db.json updated");
    console.log("---------------------------------------------------");
   });
    res.json(storedData);
  })
});

// Start the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("===================================================");
  console.log("NoteTaker is now online at PORT " + PORT);
  console.log("---------------------------------------------------");
});

// =============================================================
// =============================================================