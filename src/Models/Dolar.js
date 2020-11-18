module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Dolar', {
    dia: {type: DataTypes.DATE},
    compra: DataTypes.INTEGER,
    venta: DataTypes.INTEGER,
    variacion: DataTypes.INTEGER
  });
  Model.associate = function(db){}
  return Model;
}
