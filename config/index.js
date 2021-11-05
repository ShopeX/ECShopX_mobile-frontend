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

const config = {
  projectName: pkg.name,
  date: "2019-7-31",
  designWidth: 750,
  deviceRatio: {
    "640": 2.34 / 2,
    "750": 1,
    "828": 1.81 / 2
  },
  sourceRoot: "src",
  outputRoot: DIST_PATH,
  babel: {
    sourceMap: true,
    presets: [
      [
        "env",
        {
          modules: false
        }
      ]
    ],
    plugins: [
      "lodash",
      "transform-decorators-legacy",
      "transform-class-properties",
      "transform-object-rest-spread",
      [
        "transform-runtime",
        {
          helpers: false,
          polyfill: false,
          regenerator: true,
          moduleName: "babel-runtime"
        }
      ]
    ]
  },
  sass: {
    resource: path.resolve(__dirname, "..", "src/style/imports.scss"),
    projectDirectory: path.resolve(__dirname, "..")
  },
  defineConstants: getDefineConstants(CONST_ENVS),
  alias: {
    "@": join(__dirname, "../src")
  },
  copy: {
    patterns: copyPatterns
  },
  plugins: [
    "@shopex/taro-plugin-modules",
    path.join(__dirname, "./modify-taro.js"),
    "@tarojs/plugin-sass",
    "@tarojs/plugin-uglify"
  ],
  // 开启压缩
  uglify: {
    enable: IS_PROD,
    config: {
      // 配置项同 https://github.com/mishoo/UglifyJS2#minify-options
      compress: {
        drop_console: IS_PROD,
        drop_debugger: IS_PROD
      }
    }
  },
  mini: {
    webpackChain(chain, webpack) {
      chain.merge({
        optimization: {
          splitChunks: {
            cacheGroups: {
              lodash: {
                name: "lodash",
                priority: 1000,
                test(module) {
                  return /node_modules[\\/]lodash/.test(module.context);
                }
              },
              moment: {
                name: "date-fns",
                priority: 1000,
                test(module) {
                  return /node_modules[\\/]date-fns/.test(module.context);
                }
              }
            }
          }
        }
      });
      // if (isPro) {
      //   chain.plugin('analyzer')
      //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
      // }
      chain
        .plugin("IgnorePlugin")
        .use(webpack.IgnorePlugin, [/^\.\/locale$/, /date-fns$/]);
      chain
        .plugin("LodashModuleReplacementPlugin")
        .use(require("lodash-webpack-plugin"), [
          {
            coercions: true,
            paths: true
          }
        ]);
    },
    commonChunks(commonChunks) {
      commonChunks.push("lodash");
      commonChunks.push("date-fns");
      return commonChunks;
    },
    // 图片转换base64
    imageUrlLoaderOption: {
      limit: 0
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: ["last 3 versions", "Android >= 4.1", "ios >= 8"]
        }
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
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      }
    }
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    router: {
      mode: "browser"
    },
    // devServer: {
    //   https: {
    //     key: "../cert/ecshopx-server.key",
    //     cert: "../cert/ecshopx-server.crt",
    //     // passphrase: "webpack-dev-server",
    //     requestCert: true
    //   }
    // },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: ["last 3 versions", "Android >= 4.1", "ios >= 8"]
        }
      }
    },
    esnextModules: ["taro-ui"],
    webpackChain(chain, webpack) {
      chain.merge({
        resolve: {
          alias: {
            react$: "nervjs",
            "react-dom$": "nervjs"
          }
        }
      });
      chain.merge({
        optimization: {
          splitChunks: {
            cacheGroups: {
              lodash: {
                name: "lodash",
                priority: 1000,
                test(module) {
                  return /node_modules[\\/]lodash/.test(module.context);
                }
              },
              moment: {
                name: "date-fns",
                priority: 1000,
                test(module) {
                  return /node_modules[\\/]date-fns/.test(module.context);
                }
              }
            }
          }
        }
      });
      // if (!isPro) {
      //   chain.plugin('analyzer')
      //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
      // }
      chain
        .plugin("IgnorePlugin")
        .use(webpack.IgnorePlugin, [/^\.\/locale$/, /date-fns$/]);
      chain
        .plugin("LodashModuleReplacementPlugin")
        .use(require("lodash-webpack-plugin"), [
          {
            coercions: true,
            paths: true
          }
        ]);
    }
  }
};

module.exports = function(merge) {
  if (!IS_PROD) {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
