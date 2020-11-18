const {Bet, User, Board} = require('../Models');
const axios = require('axios');
const {Op} = require('sequelize');
// const fs = require('fs');
var xd = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales';
const {DateTime} = require('luxon');

async function checkBets_Daily() {
  try {
    const response = await axios.default.get(xd)
    var betDay;
    if (process.env['MODE'].toLowerCase() != 'develop') betDay = DateTime.utc().setZone('America/BuenosAires').startOf('day').toISO();
    else betDay = DateTime.utc().plus({day: 1}).startOf('day').toISO();
    var data = response.data;
    const dolar = data.filter(item => item.casa.nombre == 'Dolar Blue')[0].casa;
    const compra = parseInt(dolar.compra);
    const venta = parseInt(dolar.venta);
    const docs = await Bet.findAll({where: {[Op.or]: {venta: venta, compra: compra}, betDay}, include: [{model: User}]})
    for (const item of docs) {
      if (item.compra == compra && item.venta == venta) {
        item.User.points += item.points * 8;
      } else {
        item.User.points += item.points * 4;
      }
      await item.User.save();
    }
    await Bet.destroy({where: {betDay}})
    const users = await User.findAll({include: [{model: Bet, where: {betDay}, paranoid: false}]})
    for (const user of users) {
      await user.updatePoints();
    }
    const topo = await User.findAll({
      limit: 9,
      order: [['totalPoints', 'DESC']],
      attributes: ['totalPoints', 'name'],
      raw: true
    });
    await Board.create({jsonString: JSON.stringify(topo)});
  } catch (e) {
    console.log(e);
  }
}
checkBets_Daily();
module.exports = {checkBets_Daily}
