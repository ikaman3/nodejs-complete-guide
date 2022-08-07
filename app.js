'use strict';

// Node.js Core Modules
const http = require('http');
const path = require('path');

// third party modules
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// 내가 임포트한 파일
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { 
        pageTitle: 'Page Not Found!', 
        path: ''
    });
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000); // 위의 코드와 동등한 결과를 간단하게 표현