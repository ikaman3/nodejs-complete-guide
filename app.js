'use strict';

// Node.js Core Modules
const http = require('http');
const path = require('path');

// third party modules
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// 내가 임포트한 파일
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constranints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
.sync({ force: true })
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});