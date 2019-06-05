const path = require('path')
const pkg = require('../package.json')

const [TARO_CMD, TARO_ENV] = process.env.npm_lifecycle_event.split(':')
const DIST_PATH = 'dist'
const API_HOST = 'bbc54.shopex123.com'
// const API_HOST = process.env.NODE_ENV === 'production'
//   ? 'b.pjinjin.com'
//   : 'pjj.aixue7.com'

const config = {
  projectName: pkg.name,
  date: '2019-4-9',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: DIST_PATH,
  plugins: {
    babel: {
      sourceMap: true,
      presets: [
        ['env', {
          modules: false
        }]
      ],
      plugins: [
        'transform-decorators-legacy',
        'transform-class-properties',
        'transform-object-rest-spread'
      ]
    }
  },
  defineConstants: {
    APP_NAME: `'${pkg.app_name}'`,
    APP_VERSION: `'${pkg.version}'`,
    API_HOST: `'${API_HOST}'`,
    APP_BASE_URL: TARO_ENV === 'h5'
      ? `'//${API_HOST}/index.php/api/h5app/wxapp'`
      : `https://${API_HOST}/index.php/api/h5app/wxapp`,
    APP_COMPANY_ID: '1',
    APP_INTEGRATION: process.env.INTEGRATION_APP,

    APP_AUTH_PAGE: '/pages/auth/login',
    // APP_AUTH_PAGE: TARO_ENV === 'weapp'
    //   ? '/pages/auth/wxauth'
    //   : '/pages/auth/login'
  },
  alias: {
    '@': path.join(__dirname, '../src')
  },
  copy: {
    patterns: [
      { from: 'src/assets', to: `${DIST_PATH}/assets` },
      { from: 'src/ext.json', to: `${DIST_PATH}/ext.json` }
    ],
    options: {
    }
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [
              'last 3 versions',
              'Android >= 4.1',
              'ios >= 8'
            ]
          }
        },
        pxtransform: {
          enable: true,
          config: {

          }
        },
        url: {
          enable: true,
          config: {
            limit: 10240 // 设定转换尺寸上限
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    router: {
      mode: 'browser',
    },
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: [
              'last 3 versions',
              'Android >= 4.1',
              'ios >= 8'
            ]
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    },
    devServer: {
      host: '0.0.0.0'
    },
    esnextModules: ['taro-ui'],
    webpackChain (chain) {
      chain.merge({
        resolve: {
          alias: {
            'react$': 'nervjs',
            'react-dom$': 'nervjs'
          }
        }
      })
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
