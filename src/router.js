const { authCallback, requestAuth} = require('./Interface/RedditInterface');
const { getAccountInfo, getBoard } = require('./Interface/UserInterface');
const { createSimpleBet, getMyBets } = require('./Interface/BetInterface');
const {DateTime} = require('luxon');
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()) return next();
  else return res.redirect('/login');
}
function logOut(req, res){
  req.logout();
  res.redirect('/');
}
module.exports = (app) => {
  app.get('/api/reddit_auth', authCallback);
  app.get('/api/account', getAccountInfo);
  app.get('/api/get_bets', ensureAuthenticated, getMyBets);
  app.post('/api/create_bet', ensureAuthenticated, createSimpleBet);
  app.get('/api/auth/reddit', requestAuth);
  app.get('/api/logout', logOut);
  app.get('/api/get_board', getBoard);
}
