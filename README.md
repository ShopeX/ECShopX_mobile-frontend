项目使用React 语法规范的多端统一开发框架[taro](https://taro.aotu.io/)

# 配置

api配置

/config/host.js

```js
h5: { // h5端
  prod: 'ecshopx.shopex123.com', //生产环境
  preissue: 'ecshopx.shopex123.com', //预发布环境
  test: 'ecshopx.shopex123.com' //测试环境
},
weapp: { // 小程序端
  prod: 'ecshopx.shopex123.com',
  preissue: 'ecshopx.shopex123.com',
  test: 'ecshopx.shopex123.com'
}
```

cdn配置

/package.json

```js
"cdn": {
  "publicPath": "*host*",
  "bucket": "***",
  "path": "h5/"
}
```

# 开发
node version >= v9.10.0

```js
npm install
npm run dev:h5
npm run dev:weapp
```

# 发布

```js
npm run build:weapp
release:h5
```
