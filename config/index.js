import { join } from 'path'
import dotenvFlow from 'dotenv-flow'
import { name as _name, app_name, version } from '../package.json'

dotenvFlow.config()

const {
  TARO_ENV = 'weapp',
  NODE_ENV = 'development',
  APP_BASE_URL,
  APP_WEBSOCKET,
  APP_COMPANY_ID,
  APP_PLATFORM,
  APP_CUSTOM_SERVER,
  APP_HOME_PAGE,
  INTEGRATION_APP
} = process.env

// 是否为web
const isWeb = TARO_ENV === 'h5'
// 是否为生产模式
const isPro = NODE_ENV === 'production'

const config = {
  projectName: _name,
  date: '2019-7-31',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: `dist/${TARO_ENV}`,
  babel: {
    sourceMap: true,
    presets: [
      ['env', {
        modules: false
      }]
    ],
    plugins: [
      'lodash',
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-object-rest-spread',
      ['transform-runtime', {
        "helpers": false,
        "polyfill": false,
        "regenerator": true,
        "moduleName": 'babel-runtime'
      }]
    ]
  },
  defineConstants: {
    APP_NAME: app_name,
    APP_VERSION: version,
    API_HOST: APP_BASE_URL,
    APP_BASE_URL: APP_BASE_URL,
    APP_WEBSOCKET_URL: APP_WEBSOCKET,
    APP_INTEGRATION: INTEGRATION_APP,
    APP_COMPANY_ID,
    APP_PLATFORM,
    APP_CUSTOM_SERVER,
    APP_HOME_PAGE,
    APP_AUTH_PAGE: !isWeb ? '/pages/auth/wxauth' : '/pages/auth/login'
  },
  alias: {
    '@': join(__dirname, '../src')
  },
  copy: {
    patterns: [
      { from: 'src/assets', to: `dist/${TARO_ENV}/assets` },
      { from: 'src/ext.json', to: `dist/${TARO_ENV}/ext.json` }
    ],
    options: {
    }
  },
  // 开启压缩
  uglify: {
    enable: true,
    config: {
      // 配置项同 https://github.com/mishoo/UglifyJS2#minify-options
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },  
  mini: {
    webpackChain (chain, webpack) {
      chain.merge({
        optimization: {
          splitChunks: {
            cacheGroups: {
              lodash: {
                name: 'lodash',
                priority: 1000,
                test (module) {
                  return /node_modules[\\/]lodash/.test(module.context)
                }
              },
              moment: {
                name: 'date-fns',
                priority: 1000,
                test (module) {
                  return /node_modules[\\/]date-fns/.test(module.context)
                }
              }           
            }
          }
        }
      })
      chain.plugin('analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
      chain.plugin('IgnorePlugin')
        .use(webpack.IgnorePlugin, [/^\.\/locale$/, /date-fns$/])
      chain.plugin('LodashModuleReplacementPlugin')
        .use(require('lodash-webpack-plugin'), [{
          'coercions': true,
          'paths': true
        }])
    },
    commonChunks (commonChunks) {
      commonChunks.push('lodash')
      commonChunks.push('date-fns')
      return commonChunks
    },
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

export default function (merge) {
  if (!isPro) {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
