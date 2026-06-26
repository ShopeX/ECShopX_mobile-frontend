/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 原子接口运行环境的运行时配置。
 *
 * 注意：本目录下的文件是「原样拷贝」进 dist 的原生小程序代码，不经过 Taro/webpack 编译，
 * 因此这里读不到 `process.env.*`。基地址由构建期的 copy.transform 把占位符替换为真实值
 * （见 config/index.js 中针对本文件的 transform）；company_id / appid 走 ext.json。
 */

// 构建期会被 config/index.js 的 transform 替换为 process.env.APP_BASE_URL（含尾部 /wxapp 等前缀）
var INJECTED_BASE_URL = '__APP_BASE_URL__'
// 构建期会被替换为 process.env.APP_PLATFORM（standard / platform / b2c ...）
var INJECTED_PLATFORM = '__APP_PLATFORM__'

function getExt() {
  try {
    var ext = (wx.getExtConfigSync && wx.getExtConfigSync()) || {}
    return ext.ext || {}
  } catch (e) {
    return {}
  }
}

/** @returns {string} ecshopx-api 基地址，无尾斜杠 */
function getBaseURL() {
  var url = INJECTED_BASE_URL
  // 占位符未被替换（例如本地直接预览未走构建）时给一个兜底，便于联调时手改
  if (!url || url.indexOf('__APP_BASE_URL__') > -1) {
    url = 'https://demo-ecshopx.ishopex.cn/api/h5app/wxapp'
  }
  return String(url).replace(/\/+$/, '')
}

function getCompanyId() {
  var ext = getExt()
  return ext.company_id != null ? String(ext.company_id) : ''
}

function getAppId() {
  var ext = getExt()
  return ext.appid || ''
}

/** @returns {string} 部署版本：standard / platform / b2c / ...（占位符未替换时回退 standard） */
function getPlatform() {
  var p = INJECTED_PLATFORM
  if (!p || p.indexOf('__APP_PLATFORM__') > -1) return 'standard'
  return String(p)
}

module.exports = {
  getBaseURL: getBaseURL,
  getCompanyId: getCompanyId,
  getAppId: getAppId,
  getPlatform: getPlatform
}
