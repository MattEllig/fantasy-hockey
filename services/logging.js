const winston = require('winston');

require('winston-mongodb');

if (process.env.NODE_ENV !== 'production') {
    winston.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}

winston.add(new winston.transports.MongoDB({
    db: process.env.MONGO_URI,
    collection: 'logs',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    level: 'error',
}));
