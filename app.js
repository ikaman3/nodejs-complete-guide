'use strict';

// Node.js Core Modules
const http = require('http');

// third party modules
const express = require('express');

const app = express();

// app.use로 전달하는 이 함수는 모든 요청에 대해 실행된다.
app.use((req, res, next) => {
    console.log('In the middleware!');
    next();
});

app.use((req, res, next) => {
    console.log('In another middleware!');
    res.send('<h1>Hello from Express!!');
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000); // 위의 코드와 동등한 결과를 간단하게 표현