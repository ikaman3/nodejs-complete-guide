//----------------------------테스트 자동화를 위한 REST API auth 컨트롤러--------------------------
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const SECRET_KEY = require('../config/token.json').secret;

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  try {
    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashedPw,
      name: name
    });
    const result = await user.save();
    res.status(201).json({ message: 'User created!', userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: 'User updated.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//----------------------------Mongoose를 이용한 REST API auth 컨트롤러--------------------------
// const { validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const User = require('../models/user');

// const SECRET_KEY = require('../config/token.json').secret;

// exports.signup = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed.');
//     error.statusCode = 422;
//     error.data = errors.array();
//     throw error;
//   }
//   const email = req.body.email;
//   const name = req.body.name;
//   const password = req.body.password;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 12);
  
//     const user = new User({
//       email: email,
//       password: hashedPassword,
//       name: name
//     });
//     const result = await user.save();
//     res.status(201).json({ message: 'User created!', userId: result._id.toString() });
//   } catch (err) {
//     if (!err.statusCode) {
//         err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.login = async (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   let loadedUser;

//   try {
//     const user = await User.findOne({ email: email });
//     if (!user) {
//       const error = new Error('A user with this email could not be found.');
//       error.statusCode = 401;
//       throw error;
//     }
//     loadedUser = user;

//     const isEqual = await bcrypt.compare(password, user.password);
//     if (!isEqual) {
//       const error = new Error('Wrong password.');
//       error.statusCode = 401;
//       throw error;
//     }
//     const token = jwt.sign(
//       { 
//         email: loadedUser.email, 
//         userId: loadedUser._id.toString() 
//       }, 
//       SECRET_KEY, 
//       { expiresIn: '1h' }
//     );
//     res.status(200).json({ token: token, userId: loadedUser._id.toString() });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.getUserStatus = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) {
//       const error = new Error('User not found.');
//       error.statusCode = 404;
//       throw error;
//     }
//     res.status(200).json({ status: user.status });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.updateUserStatus = async (req, res, next) => {
//   const newStatus = req.body.status;
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) {
//       const error = new Error('User not found.');
//       error.statusCode = 404;
//       throw error;
//     }
//     user.status = newStatus;
    
//     const result = await user.save();
//     res.status(200).json({ message: 'User updated.' });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

//----------------------------Mongoose를 이용한 auth 컨트롤러-----------------------------------
// const crypto = require('crypto');

// const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const senderInfo = require('../config/sender-info.json');
// const { validationResult } = require('express-validator');

// const User = require('../models/user');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   prot: 587,
//   host: 'smtp.gmlail.com',
//   secure: false,
//   requireTLS: true,
//   auth: {
//     user: senderInfo.user,
//     pass: senderInfo.password
//   }
// });

// exports.getLogin = (req, res, next) => {
//   let message = req.flash('error');
//   if (message.length > 0) {
//     message = message[0];
//   } else {
//     message = null;
//   }
//   res.render('auth/login', {
//     path: '/login',
//     pageTitle: 'Login',
//     errorMessage: message,
//     oldInput: {
//       email: '',
//       password: ''
//     },
//     validationErrors: []
//   });
// };

// exports.getSignup = (req, res, next) => {
//   let message = req.flash('error');
//   if (message.length > 0) {
//     message = message[0];
//   } else {
//     message = null;
//   }
//   res.render('auth/signup', {
//     path: '/signup',
//     pageTitle: 'Signup',
//     errorMessage: message,
//     oldInput: {
//       email: '',
//       password: '',
//       confirmPassword: ''
//     },
//     validationErrors: []
//   });
// };

// exports.postLogin = (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).render('auth/login', {
//       path: '/login',
//       pageTitle: 'Login',
//       errorMessage: errors.array()[0].msg,
//       oldInput: { 
//         email: email, 
//         password: password
//       },
//       validationErrors: errors.array()
//     });
//   }

//   User.findOne({ email: email })
//     .then(user => {
//       if (!user) {
//         return res.status(422).render('auth/login', {
//           path: '/login',
//           pageTitle: 'Login',
//           errorMessage: 'Invalid email or password.',
//           oldInput: { 
//             email: email, 
//             password: password
//           },
//           validationErrors: []
//         });
//       }
//       bcrypt
//         .compare(password, user.password)
//         .then(doMatch => {
//           if (doMatch) {
//             req.session.isLoggedIn = true;
//             req.session.user = user;
//             return req.session.save(err => {
//               console.log(err);
//               res.redirect('/');
//             });
//           }
//           return res.status(422).render('auth/login', {
//             path: '/login',
//             pageTitle: 'Login',
//             errorMessage: 'Invalid email or password.',
//             oldInput: { 
//               email: email, 
//               password: password
//             },
//             validationErrors: []
//           });
//         })
//         .catch(err => {
//           console.log(err);
//           res.redirect('/login');
//         });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.postSignup = (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).render('auth/signup', {
//       path: '/signup',
//       pageTitle: 'Signup',
//       errorMessage: errors.array()[0].msg,
//       oldInput: { 
//         email: email, 
//         password: password, 
//         confirmPassword: req.body.confirmPassword 
//       },
//       validationErrors: errors.array()
//     });
//   }

//   bcrypt
//     .hash(password, 12)
//     .then(hashedPassword => {
//       const user = new User({
//         email: email,
//         password: hashedPassword,
//         cart: { items: [] }
//       });
//       return user.save();
//     })
//     .then(result => {
//       res.redirect('/login');
//       return transporter.sendMail({
//         to: email,
//         from: senderInfo.user,
//         subject: 'Signup succeeded!',
//         html: '<h1>You successfully signed up!</h1>'
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.postLogout = (req, res, next) => {
//   req.session.destroy(err => {
//     console.log(err);
//     res.redirect('/');
//   });
// };

// exports.getReset = (req, res, next) => {
//   let message = req.flash('error');
//   if (message.length > 0) {
//     message = message[0];
//   } else {
//     message = null;
//   }
//   res.render('auth/reset', {
//     path: '/reset',
//     pageTitle: 'Reset Passowrd',
//     errorMessage: message
//   });
// };

// exports.postReset = (req, res, next) => {
//   crypto.randomBytes(32, (err, buffer) => {
//     if (err) {
//       console.log(err);
//       return res.redirect('/reset');
//     }
//     const token = buffer.toString('hex');
//     User.findOne({ email: req.body.email })
//     .then(user => {
//       if (!user) {
//         req.flash('error', 'No account with that email found.');
//         return res.redirect('/reset');
//       }
//       user.resetToken = token;
//       user.resetTokenExpriation = Date.now() + 3600000;
//       return user.save();
//     })
//     .then(result => {
//       res.redirect('/');
//       transporter.sendMail({
//         to: req.body.email,
//         from: senderInfo.user,
//         subject: 'Password reset',
//         html: `
//           <p>You requested a a password reset</p>
//           <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
//         `
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
//   });
// };

// exports.getNewPassword = (req, res, next) => {
//   const token = req.params.token;
//   User
//   .findOne({ 
//     resetToken: token, 
//     resetTokenExpriation: {$gt: Date.now()} 
//   })
//   .then(user => {
//     let message = req.flash('error');
//     if (message.length > 0) {
//       message = message[0];
//     } else {
//       message = null;
//     }
//     res.render('auth/new-password', {
//       path: '/new-password',
//       pageTitle: 'New Password',
//       errorMessage: message,
//       userId: user._id.toString(),
//       passwordToken: token
//     });
//   })
//   .catch(err => {
//     const error = new Error(err);
//     error.httpStatusCode = 500;
//     return next(error);
//   });
// };

// exports.postNewPassword = (req, res, next) => {
//   const newPassword = req.body.password;
//   const userId = req.body.userId;
//   const passwordToken = req.body.passwordToken;
//   let resetUser;

//   User.findOne({ 
//     resetToken: passwordToken, 
//     resetTokenExpriation: {$gt: Date.now()}, 
//     _id: userId 
//   })
//   .then(user => {
//     resetUser = user;
//     return bcrypt.hash(newPassword, 12);
//   })
//   .then(hashedPassword => {
//     resetUser.password = hashedPassword;
//     resetUser.resetToken = undefined;
//     resetUser.resetTokenExpriation = undefined;
//     return resetUser.save();
//   })
//   .then(result => {
//     res.redirect('/login');
//   })
//   .catch(err => {
//     const error = new Error(err);
//     error.httpStatusCode = 500;
//     return next(error);
//   });
// };