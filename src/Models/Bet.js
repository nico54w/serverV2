module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Bet', {
    points: DataTypes.NUMBER,
    compra: DataTypes.NUMBER,
    venta: DataTypes.NUMBER,
    betDay: DataTypes.DATE,
    guessOptions: DataTypes.STRING,
    hitPoint: DataTypes.BOOLEAN
  }, {
    timestamps: true,
    paranoid: true
  });
  Model.associate = function(db){
    Model.belongsTo(db['User']);
  }
  return Model;
}
