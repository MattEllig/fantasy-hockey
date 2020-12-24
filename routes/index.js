const auth = require('./auth');
const error = require('../middleware/error');

module.exports = function(app) {
    app.get('/error', (req, res) => {
        throw new Error('Oh shit you fucked up');
    });
    app.use('/auth', auth);
    app.use(error);
};
