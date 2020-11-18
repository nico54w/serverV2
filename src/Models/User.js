var initialPoints = 4000;

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('User', {
    name: DataTypes.STRING,
    redditId: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    totalPoints: {
      type: DataTypes.INTEGER,
      defaultValue: initialPoints
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: initialPoints
    },
    usedPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    paranoid: true,
  });
  Model.associate = function (db) {
    Model.hasMany(db['Bet']);
  }
  Model.prototype.updatePoints = async function () {
    var bets = await this.getBets({attributes: ['points']});
    const betsPoints = bets.map(item => item.points);
    this.usedPoints = betsPoints.reduce((a, b) => a + b, 0);
    this.totalPoints = this.points + this.usedPoints;
    await this.save();
  }
  return Model;
}
