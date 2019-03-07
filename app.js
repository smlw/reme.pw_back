const config = require('./config');
const spdy = require('spdy');
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

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

// BODYPARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


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