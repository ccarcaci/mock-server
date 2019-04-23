const http = require("http")
const https = require("https")
const url = require("url")
const fs = require("fs")
const characters = require("./mocks/star-wars.json")

const httpsOptions = {
  key: fs.readFileSync(`${__dirname}/certs/privkey.pem`),
  cert: fs.readFileSync(`${__dirname}/certs/certificate.crt`),
}

const httpPort = 3000
const httpsPort = 4443

const routing = (request, response) => {
  const action = url.parse(request.url)

	if(action.pathname === "/") {
		response.writeHead(200, { "Content-Type": "text/plain" })
    response.write("Try with /characters")
    response.end()

    return
	} else if(action.pathname === "/characters") {
		response.writeHead(200, { "Content-Type": "application/json" })
    response.write(JSON.stringify(characters))
    response.end()

    return
  } else if(action.pathname === "/parrot") {
    const content = getUrlParam(action.query.split("&"), "content")

    response.writeHead(200, { "Content-Type": "application/json" })
    response.write(JSON.stringify(parrot(content)))
    response.end()

    return
  }

  response.writeHead(404)
  response.end()
}

const httpServer = http.createServer((req, res) => routing(req, res))
const httpsServer = https.createServer(httpsOptions, (req, res) => routing(req, res))

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
