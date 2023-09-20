const { isWeixin,isWeb } = require('@/utils')

var COS = ''
if (isWeixin) {
  COS = require('./cos-wx-sdk-v5.min')
}
if(isWeb){
  COS = require('./cos-js-sdk-v5.min')
}

export default COS