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

app.use(serveStatic(path.join(__dirname, 'public')))
app.use(serveStatic(path.join(__dirname, 'db')))


// Sets up the array the notes will be pushed into as JSON objects
var notes = [];


// Routes
// =============================================================

var public = path.join(__dirname, "public")

app.get("/notes", function(req, res){
    res.sendFile(path.join(public, "notes.html"))
})
app.use('/notes', express.static(public));


app.get('*', function(req, res) {
    res.sendFile(path.join(public, 'index.html'));
});
app.use('*', express.static(public));

// app.get("/api/notes", function(req, res){
//     return res.json(db.json) //this needs to read the db.json and return all saved notes as JSON
// })

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
  