var express = require("express");
// var http = require("http");

var app = express();
var port = 8080;
// app.set("port", port);

// var server = http.createServer(app);
// server.listen(port);

app.get("/", (req, res) => {
	res.send("Hello world 1!");
});

app.listen(port);
