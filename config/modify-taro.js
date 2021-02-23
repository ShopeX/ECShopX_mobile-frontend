const ConcatSource = require("webpack-sources").ConcatSource;

export default ctx => {
  ctx.modifyBuildAssets(build => {
    // BA首页workaround
    const taroJs = build.assets["taro.js"];
    if (taroJs) {
      const source = taroJs.source();
      let newSource;
      if (process.env.NODE_ENV === "production") {
        newSource = source.replace(
          /(\.eventSplitter=\/\\s\+\/;)/,
          "$1_wrapNativeSuper(Array);"
        );
        newSource = newSource.replace(
          /(throw new Error\(\"Unable to resolve global \`this\`\"\))/,
          "if(global)return global;$1"
        );
      } else {
        newSource = source.replace(
          "var RefsArray",
          "_wrapNativeSuper(Array);\nvar RefsArray"
        );
      }

      build.assets["taro.js"] = new ConcatSource(newSource);
    }
  });
};
