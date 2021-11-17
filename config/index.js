import path, { join } from "path";
import pkg from "../package.json";
const { getEnvs, getDefineConstants } = require("./utils");

require("dotenv-flow").config();

const DIST_PATH = `dist/${process.env.TARO_ENV}`;
const APP_ENVS = getEnvs();

const CONST_ENVS = {
  APP_NAME: pkg.app_name,
  APP_AUTH_PAGE:
    process.env.TARO_ENV == "h5"
      ? "/subpage/pages/auth/login"
      : "/subpage/pages/auth/wxauth",
  ...APP_ENVS
};

// 是否为生产模式
const IS_PROD = process.env.NODE_ENV === "production";

const copyPatterns = [{ from: "src/assets", to: `${DIST_PATH}/assets` }];
if (process.env.TARO_ENV != "h5") {
  copyPatterns.push({ from: "src/ext.json", to: `${DIST_PATH}/ext.json` });
}
if ( process.env.TARO_ENV != "h5" ) {
  copyPatterns.push({ from: 'src/files/', to: `dist/${process.env.TARO_ENV}` })
}

const config = {
  projectName: pkg.name,
  date: '2019-7-31',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: DIST_PATH,
  babel: {
    sourceMap: true,
    presets: [
      [
        'env',
        {
          modules: false
        }
      ]
    ],
    plugins: [
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-object-rest-spread',
      [
        'transform-runtime',
        {
          helpers: false,
          polyfill: false,
          regenerator: true,
          moduleName: 'babel-runtime'
        }
      ]
    ]
  },
  sass: {
    resource: path.resolve(__dirname, '..', 'src/style/imports.scss'),
    projectDirectory: path.resolve(__dirname, '..')
  },
  defineConstants: getDefineConstants(CONST_ENVS),
  alias: {
    '@': join(__dirname, '../src')
  },
  copy: {
    patterns: copyPatterns
  },
  plugins: [
    '@shopex/taro-plugin-modules',
    path.join(__dirname, "./modify-taro.js"),
    "@tarojs/plugin-sass",
    "@tarojs/plugin-terser"
  ],
  mini: {
    webpackChain(chain, webpack) {
      // use cache-loader both in dev & prod
      chain.module
        .rule('script')
          .use('cacheLoader')
            .loader('cache-loader')
          .before('0')

      chain.module
        .rule('template')
          .use('cacheLoader')
            .loader('cache-loader')
          .before('0')
    },
    // 图片转换base64
    imageUrlLoaderOption: {
      limit: 0
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8']
        }
      },
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
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
      mode: 'browser'
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8']
        }
      }
    },
    esnextModules: ['taro-ui'],
    webpackChain(chain, webpack) {
      chain.resolve.alias
        .set('react$', 'nervjs')
        .set('react-dom$', 'nervjs')
    }
  }
}

module.exports = function(merge) {
  if (!IS_PROD) {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
