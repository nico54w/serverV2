const {User, Board} = require('../Models');

async function getAccountInfo(req, res) {
  if (req.user) {
    const bets = await req.user.getBets({paranoid: false, order: [['createdAt', 'DESC']]});
    return res.send({bets, user: {name, totalPoints, usedPoints, points} = req.user});
  }
  else return res.send({})
}

function createUserFromReddit(accessToken, refreshToken, profile, done) {
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
  }).then(function ([user]) {
    done(null, user.id);
  });
}

async function getBoard(req, res) {
  try {
    const topo = await User.findAll({
      limit: 9,
      order: [['totalPoints', 'DESC']],
      attributes: ['totalPoints', 'name'],
      raw: true
    });
    //const board = await Board.findOne({raw: true, order: [['createdAt', 'DESC']]})
    if(topo) return res.send({board: JSON.stringify(topo)})
    //if (board) return res.send({board: board.jsonString});
    else return res.send({board: "[]"});
  } catch (e) {
    res.send({board: "[]"});
  }
}

module.exports = {getAccountInfo, createUserFromReddit, getBoard}
