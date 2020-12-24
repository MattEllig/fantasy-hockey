const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
},
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ googleId: profile.id }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return new User({ googleId: profile.id })
                    .save(null, (err, user) => done(null, user));
            } else {
                return done(null, user);
            }
        });
    }
));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
});
