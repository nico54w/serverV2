const {Bet} = require('../Models');
const {DateTime} = require('luxon');

module.exports.createSimpleBet = async function (req, res) {
  try {
    const pointsToBet = parseInt(req.body.pointsToBet) || 0;
    const compra = parseInt(req.body.compra) || 0;
    const venta = parseInt(req.body.venta) || 0;
    if (isNaN(pointsToBet) || isNaN(compra) || isNaN(venta))
      return res.status(401).send({error: 'Error. No es un numero.'});
    else if (compra <= 0 || venta <= 0 || pointsToBet <= 0) {
      return res.status(401).send({error: 'El valor tiene que ser superior a cero.'});
    }
    if (req.user.points < pointsToBet) return res.status(409).send({error: 'No tenes suficientes puntos para esa apuesta.'});
    var betDay = 0;
    const tomorrow = DateTime.local().plus({day: 1}).startOf('day');
    if(betDay < tomorrow){
      betDay = tomorrow;
    }
    const result = await Bet.create({
      UserId: req.user.id,
      points: pointsToBet,
      compra: compra,
      venta: venta,
      betDay
    });
    if (!result) return res.status(403).send({error: 'Error en el servidor! #001'});
    else if (result) {
      req.user.points -= pointsToBet;
      await req.user.updatePoints();
      await req.user.save();
      await req.user.reload();
      res.send({user: {points, usedPoints, totalPoints} = req.user, bet: result});
    }
    else return res.status(403).send({error: 'Error en el servidor! #002'});
  } catch (e) {
    console.log(e);
    res.status(403).send({error: 'Error en el servidor! #003'});
  }
}

module.exports.getMyBets = async function (req, res) {
  try {
    if (!req.user) return res.send({});
    const bets = await req.user.getBets({raw: true});
    res.send({bets});
  }
  catch (e) {
    res.send({bets: []});
  }
}
