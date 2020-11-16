const passport = require('passport');
const RedditStrategy = require('passport-reddit').Strategy;
const { User } = require('./Models');
const { createUserFromReddit } = require('./Interface/UserInterface');
var REDDIT_CONSUMER_KEY = process.env['REDDIT_USER'];
var REDDIT_CONSUMER_SECRET = process.env['REDDIT_SECRET'];
var CALLBACK_URL = process.env['REDDIT_CALLBACK'];
passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  User.findOne({where: {id: obj}}).then(function(user){
    done(null, user);
  });
});

passport.use(new RedditStrategy({
  clientID: REDDIT_CONSUMER_KEY,
  clientSecret: REDDIT_CONSUMER_SECRET,
  callbackURL: CALLBACK_URL,
  authorizationURL: 'https://ssl.reddit.com/api/v1/authorize.compact'
},createUserFromReddit));

module.exports = passport