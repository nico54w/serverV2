const {Sequelize, DataTypes} = require('sequelize');
const path = require('path');
const fs = require('fs');
var db = [];

var sequelize;
if(process.env['MODE'].toLowerCase() == 'production'){
  sequelize = new Sequelize(process.env['CLEARDB_DATABASE_URL']);
}else if(process.env['MODE'].toUpperCase() == 'develop'.toUpperCase()){
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'storage.sqlite'
  });
}

fs.readdirSync(__dirname).forEach((item) => {
  if(item != 'index.js'){
    var model = require(`./${item}`)(sequelize, DataTypes);
    db[model.name] = model;
  }
});

Object.keys(db).forEach(function(item){
  db[item].associate(db);
});

db['sequelize'] = sequelize;

module.exports = db;