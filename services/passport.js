const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config');
const LocalStrategy = require('passport-local');

// Config jwt
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorisation'),
  secretOrKey: config.secret
};

// Local Strategy
const localOptions = {
  usernameField: 'email'
};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify email and password
  User.findOne({
    email: email
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }

      if (!isMatch) {
        return done(null, false);
      }

      return done(null, user);
    })
  });
});

// Create Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
});

// Tell passport to use this Strategy

// Setup options for JWT Strategy
passport.use(jwtLogin);
passport.use(localLogin);
