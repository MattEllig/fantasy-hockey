require('dotenv').config();

const winston = require('winston');
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const express = require('express');

const port = process.env.PORT || 5000;
const app = express();

require('./services/passport');
require('./services/logging');
require('./services/database');

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

app.listen(port, () => winston.info(`Listening on port ${port}...`));
