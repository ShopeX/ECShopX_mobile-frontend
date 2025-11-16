<p align="center"><img width="300" height="auto" alt="ECShopX" src="https://github.com/user-attachments/assets/64db28c5-ce48-43aa-887f-1c926498f55b" /></p>

### <p align="center">Mobile Frontend</p>

# Getting started
Node.js (current LTS) and npm are required to run the project. To be sure about the version compatibility you can enable Node's corepack.

### System Requirements
node 16.16.0
```
nvm install 16.16.0 
nvm use 16.16.0
```

### Installation
```
cd ecshopx-vshop
npm i
```
### Configure the .env file
```shell
# Backend API Base URL
APP_BASE_URL=
  
# WebSocket Endpoint
APP_WEBSOCKET=

# System Tenant ID
APP_COMPANY_ID=1

# System Business Model (b2c/bbc)
APP_PLATFORM=b2c
  
# Mobile Web App Payment Callback Domain，used for payment result notifications.
APP_CUSTOM_SERVER=

# App Homepage Path
APP_HOME_PAGE=/pages/index

APP_TRACK=
APP_YOUSHU_TOKEN=

# WeChat Mini Program AppID，required for compiling the mini program
APP_ID=wx1e25e45145b70faa

# Map Service API Key, used for geocoding user LBS coordinates and providing location-based offline store recommendations.
APP_MAP_KEY=

# Mapping Service Provider Name
APP_MAP_NAME=

# Media files OSS Server URL
APP_IMAGE_CDN=

APP_DIANWU_URL=

APP_MERCHANT_URL=
APP_ADAPAY=
```

### Run project 
```shell
# Compile Mobile Web App
npm run dev:h5
```
```shell
# Compile WeChat Mini Program
npm run dev:weapp
```

### Build packages 
```shell
# Compile Mobile Web App
npm run build:h5
```
```shell
# Compile WeChat Mini Program
npm run build:weapp
```
