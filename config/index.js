import path from 'path'
import pkg from '../package.json'

const chalk = require('chalk')
const { getEnvs, getDefineConstants, getCacheIdentifier } = require('./utils')

require('dotenv-flow').config()

const DIST_PATH = `dist/${process.env.TARO_ENV}`
const APP_ENVS = getEnvs()
const REACT_I18NEXT_PATH = path.dirname(require.resolve('react-i18next/package.json'))
const I18NEXT_PATH = path.dirname(require.resolve('i18next/package.json'))

// 是否为生产模式
const IS_PROD = process.env.NODE_ENV === 'production'
const BUILD_TARGET = process.env.TARGET
const BUILD_APP_SERVER = process.env.SERVER

const CONST_ENVS = {
  APP_NAME: pkg.app_name,
  APP_AUTH_PAGE:
    process.env.TARO_ENV == 'h5' ? '/subpage/pages/auth/login' : '/subpages/member/index',
  APP_BUILD_TARGET: BUILD_TARGET,
  APP_LIVE: process.env.APP_LIVE,
  ...APP_ENVS,
  // 显式列入，保证 defineConstants 注入；否则客户端会保留 process.env.* 引用导致「process is not defined」
  APP_DEFAULT_MEMBER_GRADE_ID: process.env.APP_DEFAULT_MEMBER_GRADE_ID || ''
}

Object.keys(CONST_ENVS).forEach((key) => {
  console.log(chalk.green(`${key}=${CONST_ENVS[key]}`))
})

// 是否打包APP
const IS_APP = BUILD_TARGET === 'app'
// 是否打包成APP服务
const IS_APP_SERVER = BUILD_APP_SERVER === 'server'

const copyPatterns = [{ from: 'src/assets', to: `${DIST_PATH}/assets` }]
const i18nResourceTransform = (content) =>
  content.toString().replace(/\.\/locales\/(zhcn|en|ar)\.json/g, './locales/$1.js')
const i18nLocaleTransform = (content) => `module.exports = ${content.toString()}\n`

if (process.env.TARO_ENV == 'h5') {
  copyPatterns.push({ from: 'src/files', to: `${DIST_PATH}` })
}
if (process.env.TARO_ENV == 'alipay') {
  copyPatterns.push({ from: 'mini.project.json', to: `${DIST_PATH}/mini.project.json` })
}
if (process.env.TARO_ENV == 'weapp') {
  copyPatterns.push({
    from: 'src/subpages/i18n/resources.js',
    to: `${DIST_PATH}/subpages/i18n/resources.js`,
    transform: i18nResourceTransform
  })
  ;['zhcn', 'en', 'ar'].forEach((lang) => {
    copyPatterns.push({
      from: `src/subpages/i18n/locales/${lang}.json`,
      to: `${DIST_PATH}/subpages/i18n/locales/${lang}.js`,
      transform: i18nLocaleTransform
    })
  })
}

const config = {
  projectName: pkg.name,
  date: '2025-04-22',
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
    resource:
      process.env.TARO_ENV === 'weapp'
        ? ['src/style/imports.scss', 'src/style/weapp-mixins.scss']
        : ['src/style/imports.scss', 'src/style/h5-mixins.scss'],
    projectDirectory: path.resolve(__dirname, '..')
  },

  defineConstants: getDefineConstants(CONST_ENVS),
  alias: {
    'taro-ui$': 'taro-ui/lib/index',
    '@': path.join(__dirname, '../src')
    // '@lang': path.join(__dirname, '../lang')
    // 'lodash': 'lodash-es'
  },
  copy: {
    patterns: copyPatterns
  },
  compiler: {
    type: 'webpack5',
    // 依赖预编译配置
    prebundle: {
      enable: false,
      force: true
    }
  },
  plugins: [
    // path.join(__dirname, "../src/plugin/test.js")
    // path.join(__dirname, "./modify-taro.js")
  ],

  mini: {
    webpackChain(chain) {},

    compile: {
      include: [REACT_I18NEXT_PATH, I18NEXT_PATH]
    },

    miniCssExtractPluginOption: {
      ignoreOrder: true
    },
    optimizeMainPackage: {
      enable: true
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
    publicPath: IS_APP ? (IS_APP_SERVER ? '/' : './') : '/',

    router: {
      // mode: 'browser'
      // mode: 'hash',
      mode: IS_APP ? (IS_APP_SERVER ? 'browser' : 'hash') : 'browser'
    },
    webpackChain(chain) {},
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
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
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
