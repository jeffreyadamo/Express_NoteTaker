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

// Routes
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
// I dont' think this does anything:
// app.use('/notes', express.static(public));
// app.use('*', express.static(public));

app.post("/api/notes", function (req, res) {
  //Turn the posted object into a variable
  var newNote = req.body;
  console.log("newNote is " + newNote);

  //I want to push data into "notes" variable
  console.log("note is empty" + notes);

  //I want to read db.json, set its contents as a variable array, then push the new note into the array. Then i want to rewrite the db.json file anew.

  // var readNote = fs.readFile(path.join(db, "db.json"),'utf8', function(err){
  //     if(err) throw err;
  // })
  var readNote = [];
  console.log("readNote is empty" + readNote);

  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) throw err;

    console.log("data is " + data);
    // readNote.push(JSON.parse(data));
    var storedData =JSON.parse(data);
    storedData.push(newNote);
    console.log("data is now" + storedData);

    // notes.push(readNote);
    // console.log("notes is now " + notes);
    // notes.push(newNote);
    // console.log("notes is now " + notes);

    //Write new db.json file
    fs.writeFile( "db/db.json", JSON.stringify(storedData), function (err) {
        if (err) throw err;

        //What does this do?
      console.log("Done");
      
      }
    );
    res.json(true)
  });
});
app.delete("/api/notes/:id", function(req,res){
    //readFile
    // fine the index of what you need to delete and use smtng like splice (index,1)
})

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
