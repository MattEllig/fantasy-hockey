const error = require('../middleware/error');
const authRouter = require('./auth');
const playerRouter = require('./player');

module.exports = function(app) {
    app.use('/auth', authRouter);
    app.use('/api/player', playerRouter);
    app.use(error);
};
