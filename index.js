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

const routing = async (request, response) => {
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
  } else if(request.method === "GET" && action.pathname === "/parrot") {
    const content = getUrlParam(action.query.split("&"), "content")

    response.writeHead(200, { "Content-Type": "application/json" })
    response.write(JSON.stringify(parrot(content)))
    response.end()

    return
  } else if(request.method === "POST" && action.pathname === "/parrot") {
    const content = await getBody(request)

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

const getUrlParam = (rawParams, paramName) => rawParams.map(rawParam => rawParam.split("="))
  .find(param => param[0] === paramName)[1]
const parrot = (content) => ({ parrotSays: content })
const getBody = (request) => new Promise((resolve) => {
  var body = []
  request.on("data", (chunk) => body+=chunk)
  request.on("end", () => resolve(JSON.parse(body)))
})
