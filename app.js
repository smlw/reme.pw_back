const config = require('./config');
const spdy = require('spdy');
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const uuid = require("uuid");
const app = express();
app.use(cors({ origin: ["http://localhost:8080"], credentials: true }));
app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': 'http://localhost:8080',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Credentials': true
  })
  next();
});


// DATABASE
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connection
    .on('error', error => console.log(error))
    .on('close', () => console.log('Database connection closed.'))
    .once('open', () => {
        const info = mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    });

mongoose.connect(config.MONGO_URL);

app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    cookie: {
      maxAge: 24*60*60*1000 
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

const User = require('./api/models').User

passport.use(new VKontakteStrategy(
    {
      clientID:     '6892318', // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
      clientSecret: 'xpLAz80rcCDNNJwfwoVm',
      callbackURL:  "http://localhost:3001/auth/vkontakte/callback"
    },
    function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
      console.log(profile)
      User.findOne({
        vkontakteId: profile.id
      }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User ({
            vkontakteId: profile.id,
            displayName: profile.displayName,
            photoUrl: profile.photos[0].value
          });
          user.save(() => {
            if (err) console.log(err);
            return done(null, user);
          })
        } else {
            return done(err, user);
        }
      })
    }
));

// User session support for our hypothetical `user` objects.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// const loggedin = (req, res, next) => req.isAuthenticated() ? next() : res.json('Not Auth')

//This function will pass callback, scope and request new token
app.get('/auth/vkontakte', passport.authenticate('vkontakte'));

app.get('/auth/vkontakte/callback',
  passport.authenticate('vkontakte', {
    successRedirect: 'http://localhost:8080/dashboard',
    failureRedirect: 'http://localhost:8080/auth'
  })
);


app.get('/', function(req, res) {
  req.session.sessionUUID = uuid.v4();
  res.json(req.session)
  // const user = req.user
  // console.log(user)
  // if(user){
  //   res.json({
  //     user: user
  //   });
  // } else {
  //   res.json({
  //     message: 'Пользователь не аутентифицирован'
  //   })
  // }
});

app.post("/getUserInfo", (req, res, next) => {
  console.log('req.session.sessionUUID')
  console.log(req.session.sessionUUID)
  console.log('req.body.sessionUUID')
  console.log(req.body.sessionUUID)

  if(req.body.sessionUUID != req.session.sessionUUID) {
      return res.status(500).json({ message: "The data in the session does not match!" });
  } else {
    res.json({
      user: req.user
    });
  }
});

// // ROUTERS
const routes = require('./api/routes');
app.use('/api', routes.profile);

// SERVER HTTPS
// spdy
//     .createServer({
//         key: fs.readFileSync(path.resolve(__dirname, './certs/privateKey.key')),
//         cert: fs.readFileSync(path.resolve(__dirname, './certs/certificate.crt'))
//     }, app)
//     .listen(`${config.PORT}`, (err) => {
//         if (err) {
//             throw new Error(err);
//         }

//         /* eslint-disable no-console */
//         console.log(`Listening on port: ${config.PORT}`);
//         /* eslint-enable no-console */
//     });

app.listen(3001, () => {
    console.log('app listen port 3000')
})

module.exports = app;