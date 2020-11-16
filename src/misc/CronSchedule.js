const cron = require('node-cron');
const {checkBets_Daily} = require('./BetChecker');
cron.schedule('20 * * * *', function(){
  checkBets_Daily();
})