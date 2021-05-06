'use strict'

const bcrypt = require('bcryptjs')
const { roles } = require('../config/roles')

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {}
  };
  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [8, undefined],
        isLaN (value) {
          if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            throw new Error('Password must contain at least one letter and one number')
          }
        }
      }
    },
    role: {
      type: DataTypes.ENUM(roles),
      validate: {
        isIn: {
          args: [roles]
        }
      }
    },
    isEmailVerified: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeSave: async (user, options) => {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      }
    },
    sequelize,
    modelName: 'User'
  })
  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get())
    delete values.password
    delete values.createdAt
    delete values.updatedAt
    return values
  }

  User.prototype.isPasswordMatch = async function (password) {
    const user = this
    return bcrypt.compare(password, user.password)
  }

  User.isEmailTaken = async function (email) {
    const user = await this.findOne({ where: { email } })
    return !!user
  }

  User.paginate = async function (filter, options) {
    let sort = []
    if (options.sortBy) {
      const sortingCriteria = []
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':')
        sort.push([key, order])
      })
      sort = sortingCriteria.join(' ')
    } else {
      sort.push(['createdAt'])
    }

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1
    const skip = (page - 1) * limit

    const countPromise = this.count({ where: filter })
    let docsPromise = this.findAll({
      where: filter,
      order: sort,
      offset: skip,
      limit
    })

    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }))
        )
      })
    }

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values
      const totalPages = Math.ceil(totalResults / limit)
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults
      }
      return Promise.resolve(result)
    })
  }

  return User
}
