# POC Node Http Server

This project provides an easy and fast way to start writing Node code for Http Server. There are no dependencies, the implemented logic rely on Http internal library of Node ([https://nodejs.org/api/http.html](https://nodejs.org/api/http.html))

## Prerequisites

* Node/npm

## How to use

Run the server simply using npm:

```$ npm start```

### Run Using Docker Container

The project is provided with docker-compose definition that enables containerization.

That containerization has remote debugging features built-in.
To run and stop it, it is possible to use the two scripts:

```./run.sh```
```./stop.sh```

To debug the application in his containerized version using VSCode is possible to add this debugging configuration to your local launch.json file:

```json
{
  "type": "node",
  "request": "attach",
  "name": "Node Http Server - Docker Compose",
  "address": "localhost",
  "port": 9229,
  "localRoot": "${workspaceFolder}/path/to/poc-node-http-server",
  "remoteRoot": "/http-server",
  "protocol": "inspector",
},
```

## Internal structure

This project provides either Http and Https routes that serve some basic example of API.

In ```/certs``` folder is possible to provide the SSL certificates.
The ```index.js``` file provides some routes examples.

The ```/parrot``` route replays the content passed as url params (GET) or as body param (POST).
The ```/characters``` route provides a fixed JSON content.

This POC is inspired on Simple Design principles. [Take a look to them](https://www.agilealliance.org/glossary/simple-design).

## License

This project is provided under [EUPL-1.2](https://eupl.eu/1.2/en).
