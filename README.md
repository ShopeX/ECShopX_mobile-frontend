<p align="center"><img width="600" height="416" alt="logo2" src="https://github.com/user-attachments/assets/abf6c4c7-8cb1-477e-aea4-9e526cd8225a" /></p>

### <p align="center">Mobile Frontend</p>

# Getting started
Node.js (current LTS) and npm are required to run the project. To be sure about the version compatibility you can enable Node's corepack.

### System Requirements
Required Node.js Version: 16.16.0. If your current version differs, follow the steps below to switch
```
nvm install 16.16.0 
nvm use 16.16.0
```

### Installation
```
cd ECShopX_mobile-frontend
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

# System Business Model (b2c:standard/b2b2c:platform)
APP_PLATFORM=standard
  
# Mobile Web App Payment Callback Domain，used for payment result notifications.
APP_CUSTOM_SERVER=

# App Homepage Path
APP_HOME_PAGE=/pages/index

# WeChat Mini Program AppID，required for compiling the mini program
APP_ID=wx1e25e45145b70faa

# Map Service API Key, used for geocoding user LBS coordinates and providing location-based offline store recommendations.
APP_MAP_KEY=

# Mapping Service Provider Name
APP_MAP_NAME=

# Media files OSS Server URL
APP_IMAGE_CDN=

# Store Operations Tool Domain Address
APP_DIANWU_URL=

# Merchant Portal Domain Address
APP_MERCHANT_URL=

# Payment Callback URL for Third-Party Payment Platforms
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

## License
Each ECShopX source file included in this distribution is licensed under the Apache License 2.0, together with the additional terms imposed by ShopeX.

Open Software License (Apache 2.0) – Please see LICENSE.txt for the full text of the Apache 2.0 license.

每个包含在本发行版中的 ECShopX 源文件，均依据 Apache 2.0 开源许可证与ShopeX商派附加条款进行授权。

开源软件许可协议（Apache 2.0） —— 请参阅 LICENSE.txt 文件以获取 Apache 2.0 协议的完整文本。
