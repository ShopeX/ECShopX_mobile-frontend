const crypto = require('crypto')
const chalk = require("chalk")
const pkg = require('../package.json')

function digest(str) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex')
}

module.exports = {
  getEnvs() {
    const envs = Object.keys(process.env).reduce((ret, key) => {
      const val = process.env[key];
      if ( key.indexOf( "APP_" ) >= 0 ) {
        console.log(chalk.green(`${key}=${val}`));
        ret[key] = val;
      }
      return ret;
    }, {});
    return envs;
  },

  getDefineConstants(consts) {
    consts = Object.keys(consts).reduce((val, k) => {
      val[`process.env.${k}`] = `'${consts[k]}'`
      return val;
    }, {});
    return consts;
  },

  getCacheIdentifier(consts = {}) {
    const env = process.env.NODE_ENV || 'development'
    const envHash = digest(JSON.stringify(consts))

    return `cache-loader:${pkg.version} ${env} ${envHash}`
  }
}
