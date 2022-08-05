'use strict';

// Node.js Core Modules
const http = require('http');

// third party modules
const express = require('express');

const app = express();

app.use('/', (req, res, next) => {
    console.log('This always runs!!!');
    next();
});

app.use('/add-product', (req, res, next) => {
    console.log('In another middleware!');
    res.send('<h1>The add product page');
});

app.use('/', (req, res, next) => {
    console.log('In another middleware!');
    res.send('<h1>Hello from Express!!');
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000); // 위의 코드와 동등한 결과를 간단하게 표현