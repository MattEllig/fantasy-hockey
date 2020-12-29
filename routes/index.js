const auth = require('./auth');
const error = require('../middleware/error');

module.exports = function(app) {
    app.use('/auth', auth);
    app.use(error);
};
