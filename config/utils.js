const chalk = require("chalk");

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
    console.log('consts',consts)
    return consts;
  }
};
