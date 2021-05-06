const faker = require('faker')

const password = 'password1'

const userOneDetails = {
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false
}

const userTwoDetails = {
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false
}

const adminDetails = {
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false
}

module.exports = {
  userOneDetails,
  userTwoDetails,
  adminDetails
}
