# 说明文档
## .env文件配置信息
```json
  {
    "APP_BASE_URL": "接口访问地址",
    "APP_WEBSOCKET": "websocket访问地址",
    "APP_COMPANY_ID": "企业id",
    "APP_PLATFORM": "打包平台，standard为标准版, platform为平台版",
    "APP_CUSTOM_SERVER": "域名地址，H5支付回调使用",
    "APP_HOME_PAGE": "首页访问路径",
    "APP_MAP_KEY": "H5 腾讯地图使用key",
    "APP_MAP_NAME": "H5 使用地图name"
  }
```
## npm打包指令
```bash
#小程序本地开发编译
npm run dev:weapp

#小程序生产打包
npm run build:weapp 

#H5本地开发编译
npm run dev:h5

#H5生产打包
npm run build:h5


```

## 注意事项
- 关于小程序预览，dev:weapp本地开发编译模式下因为主包过大无法上传预览，需要使用build:weapp打包后选择小程序开发工具中的详情->本地设置->上传代码时自动压缩混淆

## shell脚本指令使用
- dev.sh和run.sh脚本命令使用,conpanys.conf文件为设置env.json文件的配置信息，新增配置需同已有配置格式保持一致,打包完成后需手动更改appid

```bash
#开发模式使用
sh dev.sh

#打包使用
sh run.sh
```
cicd test 3

## 代码prettier
npm run prepare
npx husky add .husky/pre-commit "npx lint-staged --allow-empty"

## 如果用ASW打包上传cdn，需要增加以下配置,配置值根据实际情况调整
APP_PUBLIC_PATH=https://CDN域名
APP_CDN=aws
APP_CDN_PATH=ecshopx-vshop/
APP_CDN_KEY=
APP_CDN_SCERET=
APP_CDN_REGION=ap-southeast-2
APP_CDN_BUCKET=unat-bucket


