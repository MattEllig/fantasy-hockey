const passport = require('passport');

const google = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleCallback = [
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/')
];

exports.google = google;
exports.googleCallback = googleCallback;
