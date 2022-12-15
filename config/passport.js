const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

module.exports = function(passport){
    //user
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = process.env.SECRET;
    passport.use("jwt",new JwtStrategy(opts, (jwt_payload, done) => {
        // console.log("payload fffff");
        User.findOne({_id: jwt_payload.userId}, (err, user) => {
        if(err){
          return done(err, false);
        }
   
        if(user){
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }));
  }