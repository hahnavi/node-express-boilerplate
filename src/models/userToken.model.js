'use strict'

const { tokenTypes } = require('../config/tokens')

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserToken extends Model {
    static associate (models) {}
  };
  UserToken.init({
    token: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    type: DataTypes.ENUM(tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL),
    expires: DataTypes.DATE,
    blacklisted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserToken'
  })
  UserToken.prototype.toJSON = function () {
    const values = Object.assign({}, this.get())
    delete values.id
    delete values.createdAt
    delete values.updatedAt
    delete values.expires
    return values
  }
  return UserToken
}
