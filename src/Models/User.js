module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('User', {
    name: DataTypes.STRING,
    redditId: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    totalPoints: {
      type: DataTypes.NUMBER,
      defaultValue: 0
    },
    points: {
      type: DataTypes.NUMBER,
      defaultValue: 4000
    },
    usedPoints: {
      type: DataTypes.NUMBER,
      defaultValue: 0
    }
  },{
    timestamps: true
  });
  Model.associate = function(db){
    Model.hasMany(db['Bet']);
  }
  return Model;
}