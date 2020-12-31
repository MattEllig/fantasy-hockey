require('dotenv').config();

const winston = require('winston');
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const express = require('express');

const port = process.env.PORT || 5000;
const app = express();

require('./startup/passport');
require('./startup/logging');
require('./startup/database');
require('./startup/seeder');

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions',
});

store.on('error', (error) => winston.error(error));

app.use(
    session({
        secret: process.env.SESSION_KEY,
        store: store,
        resave: true,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/index')(app);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static('client/dist'));

    const path = require('path');

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/client/dist/index.html'));
    });
}

app.listen(port, () => winston.info(`Listening on port ${port}...`));
