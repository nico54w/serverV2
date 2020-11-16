const crypto = require('crypto');
const passport = require('passport');

function requestAuth (req, res, next){
  req.session.state = crypto.randomBytes(32).toString('hex');
  passport.authenticate('reddit', {
    state: req.session.state,
    duration: 'permanent'
  })(req, res, next)
}
function authCallback ( req, res, next) {
  if(req.query.state == req.session.state){
    passport.authenticate('reddit', {
      successRedirect: '/',
      failureRedirect: '/'
    })(req, res, next)
  }else{
    next(new Error(403))
  }
}

module.exports = {requestAuth, authCallback}