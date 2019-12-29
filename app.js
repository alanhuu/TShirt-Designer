var express = require("express");
var app = express();
var path = require("path");
var formidable = require("formidable");
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(path.join(__dirname, "public")));

// Allow the uploads url to be accessed statically.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.post("/upload", function(req, res) {
  // Create an incoming form object.
  var form = new formidable.IncomingForm();
  console.log(form);

  // Specify that we want to allow the user to upload multiple files in a single request.
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, "uploads");

  // Every time a file has been uploaded successfully, rename it to it's orignal name.
  form.on("file", function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // Log any errors that occur.
  form.on("error", function(err) {
    console.log("An error has occured: \n" + err);
  });

  // Once all the files have been uploaded, send a response to the client.
  form.on("end", function() {
    res.end("success");
  });

  // Parse the incoming request containing the form data.
  form.parse(req);
});

app.post("/save", function(req, res) {
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "ShirtDesign"
  });

  connection.connect(function(err) {
    if (err) {
      console.error("Error connecting: " + err.stack);
      return;
    }

    console.log("Connected as id " + connection.threadId);

    connection.query(
      "INSERT INTO canvas_mappings SET ?",
      { canvasString: req.body.value },
      function(err, result) {
        if (err) throw err;

        console.log(result.insertId);
        console.log(req.body.value);
        res.end(result.insertId.toString());
      }
    );
  });
});

app.post("/load", function(req, res) {
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "ShirtDesign"
  });

  connection.connect(function(err) {
    if (err) {
      console.error("Error connecting: " + err.stack);
      return;
    }

    console.log("Connected as id " + connection.threadId);

    // Each code is mapped to a stringified version of the canvas.
    // Thus, we load the corresponding canvas back to the frontend.
    connection.query(
      "SELECT canvasString AS canvas_code from canvas_mappings where ?",
      { id: req.body.value },
      function(err, result) {
        if (err) throw err;
        if (typeof result[0] == "undefined") {
          res.end("undefined");
        } else {
          console.log(result[0].canvas_code);
          res.end(result[0].canvas_code);
        }
      }
    );
  });
});

const port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log(`Server listening on ${port}`);
});
