module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Board', {
    jsonString: DataTypes.TEXT
  }, {
    timestamps: true
  });
  Model.associate = function(db){}
  return Model;
}
