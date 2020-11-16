const { Bet } = require('../Models');
const { DateTime } = require('luxon');

module.exports.createSimpleBet = async function(req, res, next){
  // res.send({});
  const pointsToBet = parseInt(req.body.pointsToBet) || 0;
  const compra = parseInt(req.body.compra) || 0;
  const venta = parseInt(req.body.venta) || 0;
  if(isNaN(pointsToBet) || isNaN(compra) || isNaN(venta))
    return res.status(401).send({error: 'NOTANUMBER'});
  if(req.user.points < pointsToBet)return res.status(409).send({error: 'POINTS_ERROR'});
  const betDay = DateTime.local().startOf('day').toISO();
  Bet.create({
    UserId: req.user.id,
    points: pointsToBet,
    compra: compra,
    venta: venta,
    betDay
  }).then(async function(result) {
    if(!result)return res.status(403).send({error: 'NI_IDEA_WACHO'});
    else if(result){
      var bets = await Bet.findAll({
        where: {UserId: req.user.id},
        raw: true
      });
      const betsPoints = bets.map(item => item.points);
      req.user.usedPoints = betsPoints.reduce((a, b) => a + b, 0);
      req.user.points -= pointsToBet;
      req.user.totalPoints = req.user.points + req.user.usedPoints;
      req.user.save();
      res.send({user: {points, usedPoints, totalPoints} = req.user, bet: result, bets: bets});
    }
    else return res.status(403).send({error: 'NI_IDEA_WACHO 2.0'});
  }).catch(function(err){
    console.log(err);
    res.status(403).send({error: 'NI_IDEA_WACHO 3.0'});
  });
}

module.exports.getMyBets = function(req, res){
  if(!req.user) return res.send({});
  Bet.findAll({where: {UserId: req.user.id}, raw: true}).then(function(bets){
    res.send({bets: bets,});
  });
}
