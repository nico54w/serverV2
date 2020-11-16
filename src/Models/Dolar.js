module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Dolar', {
    dia: {type: DataTypes.DATE},
    compra: DataTypes.NUMBER,
    venta: DataTypes.NUMBER,
    variacion: DataTypes.NUMBER
  });
  Model.associate = function(db){}
  return Model;
}
