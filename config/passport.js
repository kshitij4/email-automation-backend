const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const Driver = require('../models/driver');
const Admin = require('../models/admin');



module.exports = function (passport) {
  //user
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.SECRET;
  passport.use("jwt", new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log("payload fffff");
    User.findOne({ _id: jwt_payload.userId }, (err, user) => {
      if (err) {
        return done(err, false);
      }

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));

  //driver
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("driver");
  opts.secretOrKey = process.env.SECRET;
  passport.use("driver", new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log("payload fffff");
    Driver.findOne({ _id: jwt_payload.id }, (err, user) => {
      if (err) {
        return done(err, false);
      }

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));

  //admin
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("admin");
  opts.secretOrKey = process.env.SECRET;
  passport.use("admin", new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log("payload fffff");
    Admin.findOne({ _id: jwt_payload.id }, (err, user) => {
      if (err) {
        return done(err, false);
      }

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
}