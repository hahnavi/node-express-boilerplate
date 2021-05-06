let envVar = 'DB_URL'
if (process.env.NODE_ENV === 'test') {
  envVar = 'DB_URL_TEST'
  process.env.DB_URL_TEST = process.env.DB_URL + '_test'
}

module.exports = {
  use_env_variable: envVar,
  dialect: 'postgres'
}
