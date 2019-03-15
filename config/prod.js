const path = require('path')

module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  weapp: {},
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
        webpackChain (chain, webpack) {
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
