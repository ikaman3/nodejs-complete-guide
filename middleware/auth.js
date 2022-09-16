// --------------------------Mongoose를 이용한 REST API 토큰 검증---------------------
const jwt = require('jsonwebtoken');

const SECRET_KEY = require('../config/token.json').secret;

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, SECRET_KEY);
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
};


// ------------------------------------Mongoose를 이용한 세션 검증------------------------------
// module.exports = (req, res, next) => {
//     if (!req.session.isLoggedIn) {
//         return res.redirect('/login');
//     }
//     next();
// }