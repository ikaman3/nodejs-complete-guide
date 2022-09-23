// ------------------GraphQL 서버-----------------------------------------------------
// const path = require('path');
// const mongodbInfo = require('./config/mongodb-info.json');

// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const graphqlHttp = require('express-graphql').graphqlHTTP;

// const graphqlSchema = require('./graphql/schema');
// const graphqlResolver = require('./graphql/resolvers');
// const auth = require('./middleware/auth');
// const { clearImage } = require('./util/file');

// const app = express();

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images');
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + '-' + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === 'image/png' || 
//     file.mimetype === 'image/jpg' || 
//     file.mimetype === 'image/jpeg'
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const MONGODB_URI = mongodbInfo.uri;

// app.use(bodyParser.json()); // application/json
// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
// app.use('/images', express.static(path.join(__dirname, 'images')));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }
//   next();
// });

// app.use(auth);

// app.put('/post-image', (req, res, next) => {
//   if (!req.isAuth) {
//     throw new Error('Not authenticated.');
//   }
//   if (!req.file) {
//     return res.status(200).json({ message: 'No file povided.' });
//   }
//   if (req.body.oldPath) {
//     clearImage(req.body.oldPath);
//   }
//   return res.status(201).json({ message: 'File stored.', filePath: req.file.path });
// });

// app.use('/graphql', graphqlHttp({
//   schema: graphqlSchema,
//   rootValue: graphqlResolver,
//   graphiql: true,
//   customFormatErrorFn(err) {
//     if (!err.originalError) {
//       return err;
//     }
//     const data = err.originalError.data;
//     const message = err.message || 'An error occurred.';
//     const code = err.originalError.code || 500;
//     return { message: message, status: code, data: data };
//   }
// }));

// app.use((error, req, res, next) => {
//   console.log(error);
//   const status = error.statusCode || 500;
//   const message = error.message;
//   const data = error.data;
//   res.status(status).json({ message: message, data: data });
// });

// mongoose
//   .connect(MONGODB_URI)
//   .then(result => {
//       app.listen(8080);
//   })
//   .catch(err => console.log(err));




// ------------------Mongoose를 이용한 REST API Express 서버----------------------------
// const path = require('path');
// const mongodbInfo = require('./config/mongodb-info.json');

// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const multer = require('multer');


// const feedRoutes = require('./routes/feed');
// const authRoutes = require('./routes/auth');

// const app = express();

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images');
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + '-' + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === 'image/png' || 
//     file.mimetype === 'image/jpg' || 
//     file.mimetype === 'image/jpeg'
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const MONGODB_URI = mongodbInfo.uri;

// // app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
// app.use(bodyParser.json()); // application/json
// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
// app.use('/images', express.static(path.join(__dirname, 'images')));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

// app.use('/feed', feedRoutes);
// app.use('/auth', authRoutes);

// app.use((error, req, res, next) => {
//   console.log(error);
//   const status = error.statusCode || 500;
//   const message = error.message;
//   const data = error.data;
//   res.status(status).json({ message: message, data: data });
// });

// mongoose
//   .connect(MONGODB_URI)
//   .then(result => {
//     const server = app.listen(8080); 
//     const io = require('./socket').init(server);
//     io.on('connection', socket => {
//       console.log('Client connected');
//     });
//   })
//   .catch(err => console.log(err));


// ------------------Mongoose를 이용한 Express 서버----------------------------
const path = require('path');
const mongodbInfo = require('./config/mongodb-info.json');

const express = require('express'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

console.log(process.env.NODE_ENV);

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.bcol3h1.mongodb.net/${process.env.MONGO_DEFALUT_DATABASE}`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({ 
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
      // throw new Error('Dummy!');
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });