/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/utils/upload.js
 * @Date: 2020-03-06 16:32:07
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-04 15:53:13
 */
import Taro from '@tarojs/taro'
import req from '@/api/req'
import * as qiniu from 'qiniu-js'

const getToken = (params) => {
  return req.get('espier/image_upload_token', params)
}

const upload = {
  aliUpload: async (item, tokenRes) => {
    const {accessid, callback = () => {}, dir, host, policy, signature} = tokenRes
    const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
    const res = await Taro.uploadFile({
      url: host,
      filePath: item.url,
      name: 'file',
      formData:{
        name: filename,
        key: `${dir}`,
        policy: policy,
        OSSAccessKeyId: accessid,
        // 让服务端返回200
        signature: signature,
        success_action_status: '200',
        // 服务端回调
        callback: callback
      }
    })
    return {
      url: `${host}${dir}`
    }
  },
  qiNiuUpload: async (item, tokenRes) => {
    const {token, key, domain, region } = tokenRes
    const res = await  Taro.uploadFile({
      url: uploadUrl,
      filePath: item.url,
      name: 'file',
      formData:{
        'token': token,
        'key': key
      }})
  },
  localUpload: async () => {

  }
}

const getUploadFun = (dirver) => {
  switch (dirver) {
    case 'oss':
      return 'aliUpload'
    case 'local':
      return 'localUpload'
    default:
      return 'qiNiuUpload'
  }
}

// 返回对应上传方式
const uploadImageFn = async (imgFiles) => {
  const { driver = 'oss', ...toeknRes } = await getToken({filetype: this.fileType})
  const uploadType = getUploadFun(driver)
  const imgs = []
  for (const item of imgFiles) {
      if (!item.file) {
        continue
      }
      const img = await uploadType[uploadType](item, toeknRes)
      imgs.push(img)
  }
  return imgs
}

export default {
  uploadImageFn: uploadImageFn
}