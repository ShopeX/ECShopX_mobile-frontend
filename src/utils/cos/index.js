import { isWeb, isWeixin } from '@/utils'

var COS = ''
if(isWeixin){
  COS = require('./cos-wx-sdk-v5.min.js')
}
if(isWeb){
  COS = require('./cos-js-sdk-v5.min.js')
}
export default COS