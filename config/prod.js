const path = require('path')

const isIntegration = process.env.INTEGRATION_APP

module.exports = {
  env: {
    NODE_ENV: '"production"',
    INTEGRATION_APP: isIntegration
  },
  plugins: {
    sass: {
      resource: [
        isIntegration
          ? path.resolve(__dirname, '..', 'src/style/iwa.scss')
          : null,
        path.resolve(__dirname, '..', 'src/style/imports.scss')
      ],
      // projectDirectory 需要配置，插件中做为~的别名
      projectDirectory: path.resolve(__dirname, '..')
    }
  }
}
