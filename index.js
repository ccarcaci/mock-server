var http = require("http");
var https = require("https");
var url = require("url");
var fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
var characters = require("./swagger-specs/star-wars.json");

const httpsOptions = {
  key: fs.readFileSync(`${__dirname}/certs/privkey.pem`),
  cert: fs.readFileSync(`${__dirname}/certs/certificate.crt`),
}

var httpPort = 8080;
var httpsPort = 4443;

const routing = (request, response) => {
  const action = url.parse(request.url);

	if(action.pathname === "/") {
		response.writeHead(200, { "Content-Type": "text/plain" });
		response.write("Try with /characters")
	} else if(action.pathname === "/characters") {
		response.writeHead(200, { "Content-Type": "application/json" });
		response.write(JSON.stringify(characters));
	} else if(action.pathname === "/demongo") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(demodata()));
  } else if(action.pathname === "/parrot") {
    const content = getUrlParam(action.query.split("&"), "content");

    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(parrot(content)));
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

    console.log("Records Found:");
    console.log(docs);
    callback(docs);
  });
}

const getUrlParam = function(rawParams, paramName) {
  return rawParams.map(rawParam => rawParam.split("=")).
    find(param => param[0] === paramName)[1];
}

const parrot = function(content) {
  return {
    parrotSays: content
  }
}
