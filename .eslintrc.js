module.exports = {
  extends: ["taro"],
  rules: {
    "no-unused-vars": ["error", { varsIgnorePattern: "Taro" }],
    "space-before-function-paren": [1, "always"],
    "import/no-named-as-default": 0
  },
  parser: "babel-eslint",
  globals: {
    TARO_APP: false,
    wx: false
  }
};


