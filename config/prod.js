const path = require('path')

const isIntegration = process.env.INTEGRATION_APP

module.exports = {
  env: {
    NODE_ENV: '"production"',
    INTEGRATION_APP: isIntegration
  },
  defineConstants: {
  },
  plugins: {
    sass: {
      resource: isIntegration
          ? path.resolve(__dirname, '..', 'src/style/iwa.scss')
          : null
    }
  }
}
