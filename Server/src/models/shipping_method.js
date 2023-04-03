'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipping_method extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Shipping_method.hasMany(models.Order, {foreignKey: 'shipping_method_id'})
    }
  }
  Shipping_method.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Shipping_method',
  });
  return Shipping_method;
};