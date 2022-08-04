'use strict';

// Node.js Core Modules
const http = require('http');

// third party modules
const express = require('express');

const app = express();

const server = http.createServer(app);

server.listen(3000);
