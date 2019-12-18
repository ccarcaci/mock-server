"use strict"

const http = require("http")
const https = require("https")
const url = require("url")
const fs = require("fs")
const characters = require("./mocks/star-wars.json")

const httpsOptions = {
  // eslint-disable-next-line no-undef
  key: fs.readFileSync(`${__dirname}/certs/privkey.pem`),
  // eslint-disable-next-line no-undef
  cert: fs.readFileSync(`${__dirname}/certs/certificate.crt`),
}

const httpPort = 3000
const httpsPort = 4443

const routing = (request, response) => {
  const action = url.parse(request.url)

  if(action.pathname === "/") { rootRoute(response) }
  else if(action.pathname === "/characters") { charactersRoute(response) }
  else if(request.method === "GET" && action.pathname === "/parrot") { parrotOnGetRoute(action, response) }
  else if(request.method === "POST" && action.pathname === "/parrot") { parrotOnPostRoute(request, response) }
  else { fallbackRoute(response) }
}

const httpServer = http.createServer((req, res) => routing(req, res))
const httpsServer = https.createServer(httpsOptions, (req, res) => routing(req, res))

httpServer.listen(httpPort, () => console.log(`HTTP Server on port ${httpPort}`))
httpsServer.listen(httpsPort, () => console.log(`HTTPS Server on port ${httpsPort}`))

// Routing Functions

const rootRoute = (response) => {
  response.writeHead(200, { "Content-Type": "text/plain" })
  response.write("Try with /characters")
  response.end()
}
const charactersRoute = (response) => {
  response.writeHead(200, { "Content-Type": "application/json" })
  response.write(JSON.stringify(characters))
  response.end()
}
const parrotOnGetRoute = (action, response) => {
  const content = getUrlParam(action.query.split("&"), "content")

  response.writeHead(200, { "Content-Type": "application/json" })
  response.write(JSON.stringify(parrot(content)))
  response.end()
}
const parrotOnPostRoute = async (request, response) => {
  const content = await getBody(request)

  response.writeHead(200, { "Content-Type": "application/json" })
  response.write(JSON.stringify(parrot(content)))
  response.end()
}
const fallbackRoute = (response) => {
  response.writeHead(404)
  response.end()
}

// Server Functions

const getUrlParam = (rawParams, paramName) => rawParams.map((rawParam) => rawParam.split("="))
  .find((param) => param[0] === paramName)[1]
const parrot = (content) => ({ parrotSays: content })
const getBody = (request) => new Promise((resolve) => {
  let body = []
  request.on("data", (chunk) => body+=chunk)
  request.on("end", () => resolve(JSON.parse(body)))
})
