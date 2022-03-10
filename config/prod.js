/* eslint-disable import/no-commonjs */
const path = require('path')

module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  h5: process.env.APP_CDN
    ? {
        output: {
          filename: 'js/[name].[hash:8].js',
          chunkFilename: 'js/[name].[chunkhash:8].js'
        },
        miniCssExtractPluginOption: {
          filename: 'css/[name].[hash:8].css',
          chunkFilename: 'css/[id].[hash:8].css'
        },
        webpackChain(chain) {
          // const pkg = require(path.resolve(__dirname, '../package.json'))
          // const { publicPath, bucket: CDNBucket, path: CDNPath } = pkg.cdn
          const publicPath = process.env.APP_PUBLIC_PATH
          const CDNPath = process.env.APP_CDN_PATH

          let plugin = {}
          if (process.env.APP_CDN == 'aws') {
            plugin = {
              'asw-s3': {
                plugin: require('webpack-s3-plugin'),
                args: [
                  {
                    exclude: /.*\.html$/,
                    s3Options: {
                      accessKeyId: process.env.APP_CDN_KEY,
                      secretAccessKey: process.env.APP_CDN_SCERET,
                      region: process.env.APP_CDN_REGION,
                      ACL: ''
                    },
                    s3UploadOptions: {
                      Bucket: process.env.APP_CDN_BUCKET
                    },
                    basePath: CDNPath
                    // cdnizerOptions: {
                    //   defaultCDNBase: 'http://asdf.ca'
                    // }
                  }
                ]
              }
            }
          }

          chain.output
            .publicPath(`${publicPath}/${CDNPath}/`)

          chain.merge({
            plugin
            // plugin: {
            //   'qn-webpack': {
            //     plugin: require('qn-webpack'),
            //     args: [{
            //       accessKey: process.env.CDN_ACCESS_KEY,
            //       secretKey: process.env.CDN_SECRET_KEY,
            //       bucket: CDNBucket,
            //       path: CDNPath,
            //       exclude: /(?:manifest\.json|\.map)$/
            //     }]
            //   }
            // }
          })
        }
      }
    : {
        output: {
          filename: 'js/[name].[hash:8].js',
          chunkFilename: 'js/[name].[chunkhash:8].js'
        },
        miniCssExtractPluginOption: {
          filename: 'css/[name].[hash:8].css',
          chunkFilename: 'css/[id].[hash:8].css'
        }
      }
}
