const winston = require('winston');
const mongoose = require('mongoose');

const db = process.env.MONGO_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(db, options).then(() => winston.info(`Connected to ${db}...`));
