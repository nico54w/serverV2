const { User, Board } = require('../Models');

function getAccountInfo(req, res){
  if(req.user){
    return res.send(req.user);
  }
  else return res.send({})
}

function createUserFromReddit(accessToken, refreshToken, profile, done) {
  // User.findOne({
  User.findOrCreate({
    where: {
      redditId: profile.id
    },
    defaults: {
      name: profile.name,
      redditId: profile.id,
      refreshToken: refreshToken,
      accessToken: accessToken
    }
  }).then(function([user]){
    done(null, user.id);
  });
}

function getBoard(req, res){
  Board.findOne({raw: true, order: [['createdAt', 'DESC']]}).then(function(topo){
    if(topo) return res.send({board: topo.jsonString});
    else return res.send({});
  });
}

module.exports= {getAccountInfo, createUserFromReddit, getBoard}
