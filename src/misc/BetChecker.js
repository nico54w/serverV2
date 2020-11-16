const {Bet, User, Board} = require('../Models');
const axios = require('axios');
const { Op } = require('sequelize');
// const fs = require('fs');
var xd = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales';
const { DateTime } = require('luxon');
function checkBets_Daily(){
  axios.default.get(xd).then(function(response){
    var betDay;
    if(process.env['MODE'].toLowerCase() != 'develop') betDay = DateTime.local().minus({day: 1}).startOf('day').toISO();
    else betDay = DateTime.local().startOf('day').toISO();
    var data = response.data;
    const dolar = data.filter(item => item.casa.nombre == 'Dolar Blue')[0].casa;
    const compra = parseInt(dolar.compra);
    const venta = parseInt(dolar.venta);
    Bet.findAll({where: {[Op.or]: {venta: venta, compra: compra}, betDay}, include: [{model: User}]})
    .then(function(docs){
      docs.forEach(function(item){
        if(item.compra == compra && item.venta == venta){
          item.User.points += item.points * 8;
        }else{
          item.User.points += item.points * 4;
        }
        item.User.save();
      });
    }).finally(function(){
      Bet.destroy({where: {betDay}}).then(function(){
        User.findAll({include: [{model: Bet, where: {betDay}, paranoid: false}]}).then(function(users){
          users.forEach(function(user){
            user.getBets({raw: true, attributes: ['points']}).then(function(bets){
              const betsPoints = bets.map(item => item.points);
              user.usedPoints = betsPoints.reduce((a, b) => a + b, 0);
              user.points -= pointsToBet;
              user.totalPoints = req.user.points + req.user.usedPoints;
              user.save();
            })
          })
        }).finally(function(){
          User.findAll({
            limit: 10,
            order: [['totalPoints','DESC']],
            attributes: ['totalPoints', 'name'],
            raw: true
          }).then(function(topo){
            Board.create({jsonString: JSON.stringify(topo)});
          });
        })
      })
    });
  });
}
module.exports = {checkBets_Daily}
