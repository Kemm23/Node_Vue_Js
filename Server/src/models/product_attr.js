'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_attr extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product_attr.init({
    product_id: DataTypes.INTEGER,
    value: DataTypes.STRING,
    price: DataTypes.FLOAT,
    quantity_in_stock: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'product_attr',
  });
  return product_attr;
};