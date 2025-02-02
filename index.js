const passport = require('./src/passport');
const express = require('express');
const app = express();

const {sequelize} = require('./src/Models');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const port = process.env['PORT'] || 9000;
const SequelizeStore = require('express-session-sequelize')(session.Store);

app.use(session({
  secret: process.env['EXPRESS_SESSION_SECRET'],
  store: new SequelizeStore({
    db: sequelize
  }),
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('morgan')('combined'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

require('./src/router.js')(app);

if(process.env['MODE'].toLowerCase() == 'production'){
  app.get('/*',function(req, res){
    res.sendFile(__dirname + '/public/index.html');
  });
}
async function main () {
  try {
    var opt = {};
    process.env['RESET_SYNC'] ? opt.force = true : opt.force = false;
    await sequelize.sync(opt);
    console.log('Connection has been established successfully.');
    app.listen(port, () => {
      console.log(`LISTENING AT ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
main();
