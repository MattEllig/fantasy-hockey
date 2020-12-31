const winston = require('winston');

winston.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
}));

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    require('winston-mongodb');

    winston.add(new winston.transports.MongoDB({
        db: process.env.MONGO_URI,
        collection: 'logs',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        level: 'error',
    }));
}
