var http = require("http")
var https = require("https")
var url = require("url")
var fs = require("fs")
var characters = require("./mocks/star-wars.json")

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

const getUrlParam = function(rawParams, paramName) {
  return rawParams.map(rawParam => rawParam.split("=")).
    find(param => param[0] === paramName)[1]
}

const parrot = function(content) {
  return {
    parrotSays: content
  }
}
