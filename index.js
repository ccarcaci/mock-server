var http = require("http");
var https = require("https");
var fs = require("fs");
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
	}

	response.end();
}

var httpServer = http.createServer((req, res) => routing(req, res));
var httpsServer = https.createServer(httpsOptions, (req, res) => routing(req, res));

httpServer.listen(httpPort, () => { console.log(`HTTP Server on port ${httpPort}`) } );
httpsServer.listen(httpsPort, () => { console.log(`HTTPS Server on port ${httpsPort}`) });
