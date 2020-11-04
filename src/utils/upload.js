/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/utils/upload.js
 * @Date: 2020-03-06 16:32:07
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-04 17:41:18
 */
import Taro from '@tarojs/taro'
import req from '@/api/req'
// import * as qiniu from 'qiniu-js'

const getToken = (params) => {
  return req.get('espier/image_upload_token', params)
}

const uploadURLFromRegionCode = (code) => {
  switch(code) {
      case 'z0': return'https://up.qiniup.com'
      case 'z1': return 'https://up-z1.qiniup.com'
      case 'z2': return 'https://up-z2.qiniup.com'
      case 'na0': return 'https://up-na0.qiniup.com'
      case 'as0': return 'https://up-as0.qiniup.com'
      default: console.error('please make the region is with one of [z0, z1, z2, na0, as0]')
  }
}

const upload = {
  aliUpload: async (item, tokenRes) => {
    const {accessid, callback = () => {}, dir, host, policy, signature} = tokenRes
    const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
    try {
      await Taro.uploadFile({
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
    } catch (e) {
      throw new Error (e)
    }
  },
  qiNiuUpload: async (item, tokenRes) => {
    const { token, key, domain, region } = tokenRes
    const url = uploadURLFromRegionCode(region)
    try {
      const { data } = await  Taro.uploadFile({
        url: url,
        filePath: item.url,
        name: 'file',
        formData:{
          'token': token,
          'key': key
      }})
      const imgData = JSON.parse(data)
      return {
        url: `${domain}/${imgData.key}`
      }
    } catch (e) {
      throw new Error (e)
    }
  },
  localUpload: async (item, tokenRes) => {
    const { filetype } = tokenRes
    const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
    try {
      const { image_url } = await Taro.uploadFile({
        url: `${req.baseURL}espier/upload_localimage`,
        filePath: item.url,
        name: 'images',
        formData:{
          name: filename,
          filetype
        }
      })
      return {
        url: image_url
      }
    } catch (e) {
      throw new Error (e)
    }
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
const uploadImageFn = async (imgFiles, filetype = 'image') => {
  const { driver = 'oss', ...toeknRes } = await getToken({ filetype })
  const uploadType = getUploadFun(driver)
  const imgs = []
  for (const item of imgFiles) {
    if (!item.file) {
      continue
    }
    try {
      const img = await upload[uploadType](item, { ...toeknRes, filetype})
      imgs.push(img)
    } catch (e) {
      console.log(e)
    }
  }
  return imgs
}

export default {
  uploadImageFn: uploadImageFn
}