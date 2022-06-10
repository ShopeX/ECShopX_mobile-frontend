import path from 'path'
import pkg from '../package.json'
const chalk = require("chalk")
const { getEnvs, getDefineConstants, getCacheIdentifier } = require('./utils')

require('dotenv-flow').config()

const DIST_PATH = `dist/${process.env.TARO_ENV}`
const APP_ENVS = getEnvs()

// 是否为生产模式
const IS_PROD = process.env.NODE_ENV === 'production'
const BUILD_TARGET = IS_PROD ? process.env.target : process.env.npm_config_target

const CONST_ENVS = {
  APP_NAME: pkg.app_name,
  APP_AUTH_PAGE:
    process.env.TARO_ENV == 'h5' ? '/subpage/pages/auth/login' : '/subpages/member/index',
  APP_BUILD_TARGET: BUILD_TARGET,
  ...APP_ENVS
}

Object.keys(CONST_ENVS).forEach(key => {
  console.log(chalk.green(`${key}=${CONST_ENVS[key]}`));
})


// 是否打包APP
const IS_APP = BUILD_TARGET === 'app'

const copyPatterns = [{ from: 'src/assets', to: `${DIST_PATH}/assets` }]
if (process.env.TARO_ENV != 'h5') {
  copyPatterns.push({ from: 'src/ext.json', to: `${DIST_PATH}/ext.json` })
}
if (process.env.TARO_ENV == 'h5') {
  copyPatterns.push({ from: 'src/files', to: `${DIST_PATH}` })
}

const config = {
  projectName: pkg.name,
  date: '2021-11-22',
  framework: 'react',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: DIST_PATH,
  sass: {
    resource: path.resolve(__dirname, '..', 'src/style/imports.scss'),
    projectDirectory: path.resolve(__dirname, '..')
  },

  defineConstants: getDefineConstants(CONST_ENVS),
  alias: {
    '@': path.join(__dirname, '../src')
  },
  copy: {
    patterns: copyPatterns
  },
  plugins: [
    '@shopex/taro-plugin-modules',
    // path.join(__dirname, "./modify-taro.js")
  ],

  mini: {
    miniCssExtractPluginOption: {
      ignoreOrder: true
    },
    // 图片转换base64
    imageUrlLoaderOption: {
      limit: 0
    },
    postcss: {
      autoprefixer: {
        enable: true
      },
      pxtransform: {
        enable: true,
        config: {}
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
    // publicPath: IS_PROD ? './' : '/',
    publicPath: '/',
    // publicPath: (IS_APP && IS_PROD) ? './' : '/',
    // publicPath: process.env.APP_PUBLIC_PATH || '/',
    staticDirectory: 'static',
    router: {
      // mode: IS_APP ? "hash" : "browser"
      mode: "browser"
    },
    devServer: {
      // https: true,
      // overlay: {
      //   warnings: false,
      //   errors: false
      // }
      // https: {
      //   key: "../cert/ecshopx-server.key",
      //   cert: "../cert/ecshopx-server.crt",
      //   // passphrase: "webpack-dev-server",
      //   requestCert: true
      // }
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8']
        }
      }
    },
    esnextModules: ['taro-ui']
  }
}

module.exports = function (merge) {
  if (!IS_PROD) {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
