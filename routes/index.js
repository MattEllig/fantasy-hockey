const error = require('../middleware/error');
const authRouter = require('./auth');
const goalieRouter = require('./goalie');
const skaterRouter = require('./skater');

module.exports = function(app) {
    app.use('/auth', authRouter);
    app.use('/api/goalie', goalieRouter);
    app.use('/api/skater', skaterRouter);
    app.use(error);
};
