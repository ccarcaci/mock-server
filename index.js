var http = require("http");
var https = require("https");
var fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
var characters = require("./star-wars.json");

const httpsOptions = {
  key: fs.readFileSync(`${__dirname}/certs/privkey.pem`),
  cert: fs.readFileSync(`${__dirname}/certs/certificate.crt`),
}

var httpPort = 8080;
var httpsPort = 4443;

const routing = (request, response) => {
	const url = request.url;

	if(url === "/") {
		response.writeHead(200, { "Content-Type": "text/plain" });
		response.write("Try with /characters")
	} else if(url === "/characters") {
		response.writeHead(200, { "Content-Type": "application/json" });
		response.write(JSON.stringify(characters));
	} else if(url === "/demongo") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(demodata()));
  }

	response.end();
}

var httpServer = http.createServer((req, res) => routing(req, res));
var httpsServer = https.createServer(httpsOptions, (req, res) => routing(req, res));

httpServer.listen(httpPort, () => { console.log(`HTTP Server on port ${httpPort}`) } );
httpsServer.listen(httpsPort, () => { console.log(`HTTPS Server on port ${httpsPort}`) });

// Server functions

const demodata = function() {
  const mongoUrl = "mongodb://localhost:27017";
  const dbName = "demoproj";
  const client = new MongoClient(mongoUrl, { useNewUrlParser: true });

  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected to Mongodb server");
    
    const db = client.db(dbName);
    
    insertDocuments(db, function() {
      findDocuments(db, function() {
        client.close();
      });
    });
  });
}

const insertDocuments = function(db, callback) {
  const collection = db.collection("demodoc");

  collection.insertMany([
    { a : 1 }, { a : 2 }, { a : 3 }
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);

    console.log("Inserted 3 docs into the collection");
    callback(result);
  });
}

const findDocuments = function(db, callback) {
  const collection = db.collection("demodoc");

  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);

    console.log("Found the records:");
    console.log(docs);
    callback(docs);
  });
}
