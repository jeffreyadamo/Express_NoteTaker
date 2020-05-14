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
})
//the '*' indicates anything other path will return with index.html
app.get('*', function(req, res) {
    res.sendFile(path.join(public, 'index.html'));
});
// I dont' think this does anything:
// app.use('/notes', express.static(public));
// app.use('*', express.static(public));






app.post("/api/notes", function(req, res){
    var newNote = req.body;
    console.log = newNote;
    //I think I need to push newNote to db.json here: this will append a JSON object to the db.json file, but not inside the array.
    fs.appendFile(path.join(db, "db.json"), JSON.stringify(newNote), 'utf8', function(err){
        if(err) throw err;
    });

    // notes.push(newNote);
    res.json(newNote);
    

})

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  