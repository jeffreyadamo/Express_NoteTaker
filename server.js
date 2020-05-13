// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
var serveStatic = require("serve-static")

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


// Routes
// =============================================================


app.get("/notes", function(req, res){
    res.sendFile(path.join(public, "notes.html"))
})
app.get("/api/notes", function(req, res){
    res.sendFile(path.join(db, "db.json"))
    
    // return res.json(db.json) //this needs to read the db.json and return all saved notes as JSON
})

app.get('*', function(req, res) {
    res.sendFile(path.join(public, 'index.html'));
});
// I dont' think this does anything:
// app.use('/notes', express.static(public));
// app.use('*', express.static(public));






// app.post("api/notes", function(req, res){
//     var newNotes = req.body;

//     newNotes.routeName = newNotes.name.replace(/\s+/g, "").toLowerCase();
//     notes.push(newNotes);
//     res.json(newNotes);

// })

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  