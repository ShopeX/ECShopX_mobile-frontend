/* eslint-disable import/no-commonjs */
const path = require('path')

const isIntegration = process.env.INTEGRATION_APP
const resource = (isIntegration
  ? [path.resolve(__dirname, '..', 'src/style/iwa.scss')]
  : []).concat(path.resolve(__dirname, '..', 'src/style/imports.scss'))

module.exports = {
  env: {
    NODE_ENV: '"production"',
    INTEGRATION_APP: isIntegration
  },
  sass: {
    resource,
    // projectDirectory 需要配置，插件中做为~的别名
    projectDirectory: path.resolve(__dirname, '..')
  },
  h5: process.env.RELEASE === 'h5'
    ? {
        output: {
          filename: 'js/[name].[hash:8].js',
          chunkFilename: 'js/[name].[chunkhash:8].js'
        },
        miniCssExtractPluginOption: {
          filename: 'css/[name].[hash:8].css',
          chunkFilename: 'css/[id].[hash:8].css'
        },
        webpackChain (chain) {
          const pkg = require(path.resolve(__dirname, '../package.json'))
          const { publicPath, bucket: CDNBucket, path: CDNPath } = pkg.cdn

          chain.output
            .publicPath(`${publicPath}${CDNPath}`)

          chain.merge({
            resolve: {
              alias: {
                'react': 'nervjs',
                'react-dom': 'nervjs'
              }
            },
            plugin: {
              'qn-webpack': {
                plugin: require('qn-webpack'),
                args: [{
                  accessKey: process.env.CDN_ACCESS_KEY,
                  secretKey: process.env.CDN_SECRET_KEY,
                  bucket: CDNBucket,
                  path: CDNPath,
                  exclude: /(?:manifest\.json|\.map)$/
                }]
              }
            }
          })
        }
      }
    : {}
}
