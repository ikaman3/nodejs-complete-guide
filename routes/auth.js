// ------------------------------Mongoose를 이용한 REST API user 인증 라우트-------------------
const express = require('express');
const body = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        })
      })
      .normalizeEmail(),
      body('password').trim().isLength({ min: 5 }),
      body('name').trim().not().isEmpty()
  ],
  authController.signup
);

module.exports = router;




// ------------------------------Mongoose를 이용한 user 인증 라우트----------------------------
// const express = require('express');
// const { check, body } = require('express-validator');

// const authController = require('../controllers/auth');
// const User = require('../models/user');

// const router = express.Router();

// router.get('/login', authController.getLogin);

// router.get('/signup', authController.getSignup);

// router.post(
//     '/login', 
//     [
//         body('email')
//           .isEmail()
//           .withMessage('Please enter a valid email address.')
//           .normalizeEmail(),
//         body('password', 'Password has to be valid.')
//           .isLength({ min: 5 })
//           .isAlphanumeric()
//           .trim()
//     ],   
//     authController.postLogin
// );

// router.post(
//     '/signup',
//     [
//       check('email')
//         .isEmail()
//         .withMessage('Please enter a valid email.')
//         .custom((value, {req}) => {
//           return User.findOne({ email: value }).then(userDoc => {
//             if (userDoc) {
//               return Promise.reject(
//                 'E-mail exists already, please pick a different one.'
//               );
//             }
//           })
//         })
//         .normalizeEmail(),
//       body(
//         'password', 
//         'Please enter a password with only numbers and text and at lease 5 characters.'
//       )
//         .isLength({ min: 5 })
//         .isAlphanumeric()
//         .trim(),
//       body('confirmPassword')
//         .trim()
//         .custom((value, { req }) => {
//           if (value !== req.body.password) {
//             throw new Error('Passwords have to match!');
//           }
//           return true;
//         })
//     ],
//     authController.postSignup
// );

// router.post('/logout', authController.postLogout);

// router.get('/reset', authController.getReset);

// router.post('/reset', authController.postReset);

// router.get('/reset/:token', authController.getNewPassword);

// router.post('/new-password', authController.postNewPassword);

// module.exports = router;