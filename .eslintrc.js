module.exports = {
  extends: ['taro/react'],
  ignorePatterns: ['**/*.scss', '.cz-config.js'],
  rules: {
    'import/no-commonjs': 'off',
    'import/no-named-as-default': 'off',
    'import/no-duplicates': 'off',
    'no-unused-vars': 'off',
    'no-var': 'off',
    'no-shadow': 'off',
    'no-undef': 'off',
    'no-use-before-defin': 'off',
    'no-use-before-define': 'off',
    'no-restricted-globals': ['error', 'isFinite'],
    'react/react-in-jsx-scope': 'off',
    'react/sort-comp': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/no-did-update-set-state': 'off',
    'react/no-unused-state': 'off',
    'react/no-string-refs': 'off',
    'react/no-unescaped-entities': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'react/no-direct-mutation-state': 'off',
    'react/jsx-key': 'off',
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx', '.tsx'] }]
  },
  globals: {
    TARO_APP: false,
    wx: false
  }
}
