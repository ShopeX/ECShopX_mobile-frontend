<p align="center"><img width="300" height="auto" alt="ECShopX" src="https://github.com/user-attachments/assets/64db28c5-ce48-43aa-887f-1c926498f55b" /></p>

### <p align="center">Mobile Frontend</p>

# Getting started
Node.js (current LTS) and npm are required to run the project. To be sure about the version compatibility you can enable Node's corepack.

### Installation
```
cd ecshopx-vshop
npm i
```
### Configure the .env file
```
# Backend API Base URL
APP_BASE_URL=https://demo-ecshopx.ishopex.cn/api/h5app/wxapp
  
# WebSocket Endpoint
APP_WEBSOCKET=wss://demo-ecshopx.ishopex.cn/ws

# System Tenant ID
APP_COMPANY_ID=1

# System Business Model (b2c/bbc)
APP_PLATFORM=standard

APP_CUSTOM_SERVER=https://ecshopx-h5.ex-sandbox.com/
APP_HOME_PAGE=/pages/index
APP_TRACK=youshu
APP_YOUSHU_TOKEN=bi281e87ab2424481a
APP_ID=wx1e25e45145b70faa
APP_MAP_KEY=PSPBZ-KQ5CW-CSGRF-ON2S4-K2HQJ-XEBQG
APP_MAP_NAME=oneX新零售门店定位
APP_IMAGE_CDN=https://b-img-cdn.yuanyuanke.cn/ecshopx-vshop
APP_DIANWU_URL=https://demo-ecshopx-dianwu.shopex123.com
APP_MERCHANT_URL=
APP_ADAPAY=
```

### Run project 
```
npm run dev:h5
```
```
npm run dev:weapp
```

### Build packages 
```
npm run build:weapp
```
```
npm run build:weapp
```
