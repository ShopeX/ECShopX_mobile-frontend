/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
let COS = ''
if (process.env.TARO_ENV === 'weapp') {
  COS = require('./cos-wx-sdk-v5.min')
}
if(process.env.TARO_ENV === 'h5'){
  COS = require('./cos-js-sdk-v5.min')
}

export default COS
