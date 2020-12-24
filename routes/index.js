const auth = require('./auth');
const error = require('../middleware/error');

module.exports = function(app) {
    app.get('/', (req, res) => {
        res.send('Hello world!');
    });

    app.use('/auth', auth);
    app.use(error);
};
