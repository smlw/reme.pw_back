const config = require('./config');
const spdy = require('spdy');
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
app.use(cors())
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
      })
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
      // Now that we have user's `profile` as seen by VK, we can
      // use it to find corresponding database records on our side.
      // Also we have user's `params` that contains email address (if set in 
      // scope), token lifetime, etc.
      // Here, we have a hypothetical `User` class which does what it says.
      console.log(profile)
      User.findOrCreate(
        { 
          vkontakteId: profile.id,
          displayName: profile.displayName,
          photoUrl: profile.photos[0].value
        })
        .then((user) => done(null, user))
        .catch(done);
    }
));

// User session support for our hypothetical `user` objects.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


//This function will pass callback, scope and request new token
app.get('/auth/vkontakte', passport.authenticate('vkontakte'));

app.get('/auth/vkontakte/callback',
  passport.authenticate('vkontakte', {
    successRedirect: '/',
    failureRedirect: '/login' 
  })
);

app.get('/', function(req, res) {
    //Here you have an access to req.user
    res.json(req.user);
});

// // ROUTERS
const routes = require('./api/routes');
app.use('/api', routes.profile);
// app.use('/', routes.index);

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