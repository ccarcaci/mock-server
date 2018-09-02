var express = require("express");
var mxx = require("./model");

var app = express();
var port = 8080;

app.get("/", (req, res) => {
	res.send("Hello world!");
});

app.listen(port);

var router = express.Router();

const foo = function(req, res, next) {
	res.json(mxx.Foo("Hey!"));
};

router.route("/foo").
	get(foo);

app.use("/api/v1", router);
