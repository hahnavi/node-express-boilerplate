'use strict'

const { tokenTypes } = require('../../config/tokens')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM(tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL)
      },
      expires: {
        type: Sequelize.DATE
      },
      blacklisted: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserTokens')
  }
}
