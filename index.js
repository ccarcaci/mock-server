var http = require("http")
var https = require("https")
var url = require("url")
var fs = require("fs")
const MongoClient = require("mongodb").MongoClient
const assert = require("assert")
var characters = require("./swagger-specs/star-wars.json")

const httpsOptions = {
  key: fs.readFileSync(`${__dirname}/certs/privkey.pem`),
  cert: fs.readFileSync(`${__dirname}/certs/certificate.crt`),
}

var httpPort = 8080
var httpsPort = 4443

const routing = (request, response) => {
  const action = url.parse(request.url)

	if(action.pathname === "/") {
		response.writeHead(200, { "Content-Type": "text/plain" })
    response.write("Try with /characters")
    response.end()
	} else if(action.pathname === "/characters") {
		response.writeHead(200, { "Content-Type": "application/json" })
    response.write(JSON.stringify(characters))
    response.end()
	} else if(action.pathname === "/demongo") {
    response.writeHead(200, { "Content-Type": "application/json" })

    demodata().then((data) => {
      response.write(JSON.stringify(data))
      response.end()
    }).catch(error =>
      console.log(error.message))
  } else if(action.pathname === "/parrot") {
    const content = getUrlParam(action.query.split("&"), "content")

    response.writeHead(200, { "Content-Type": "application/json" })
    response.write(JSON.stringify(parrot(content)))
    response.end()
  }
}

var httpServer = http.createServer((req, res) => routing(req, res))
var httpsServer = https.createServer(httpsOptions, (req, res) => routing(req, res))

httpServer.listen(httpPort, () => { console.log(`HTTP Server on port ${httpPort}`) } )
httpsServer.listen(httpsPort, () => { console.log(`HTTPS Server on port ${httpsPort}`) })

// Server functions

const demodata = function() {
  const mongoUrl = "mongodb://localhost:27017"
  
  return MongoClient.connect(mongoUrl, { useNewUrlParser: true }).then((client) => {
    console.log("Connected to Mongodb server")
  
    var collection = client.db("demoproj").collection("demodoc")

    return collection.insertMany([{ a : 1 }, { a : 2 }, { a : 3 } ]).then((result) => {
      assert.equal(3, result.result.n)
      assert.equal(3, result.ops.length)

      console.log("Inserted 3 docs into collection")

      return collection.find({}).toArray()
    }).catch((error)  => console.log(error.message))
  }).catch(error => console.log(error.message))
}

const getUrlParam = function(rawParams, paramName) {
  return rawParams.map(rawParam => rawParam.split("=")).
    find(param => param[0] === paramName)[1]
}

const parrot = function(content) {
  return {
    parrotSays: content
  }
}
