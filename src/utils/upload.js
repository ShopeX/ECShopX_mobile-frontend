/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/utils/upload.js
 * @Date: 2020-03-06 16:32:07
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-11 10:59:21
 */
import Taro from '@tarojs/taro'
import req from '@/api/req'
// import * as qiniu from 'qiniu-js'

const getToken = (params) => {
  return req.get('espier/image_upload_token', params)
}

// const uploadURLFromRegionCode = (code) => {
//   switch(code) {
//       case 'z0': return'https://up.qiniup.com'
//       case 'z1': return 'https://up-z1.qiniup.com'
//       case 'z2': return 'https://up-z2.qiniup.com'
//       case 'na0': return 'https://up-na0.qiniup.com'
//       case 'as0': return 'https://up-as0.qiniup.com'
//       default: console.error('please make the region is with one of [z0, z1, z2, na0, as0]')
//   }
// }

const upload = {
  aliUpload: async (item, tokenRes) => {
    const {accessid, dir, host, policy, signature} = tokenRes
    const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
    try {
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
          // callback: callback
        }
      })
      if (!res) {
        return false
      }
      return {
        url: `${host}${dir}`
      }
    } catch (e) {
      throw new Error (e)
    }
  },
  qiNiuUpload: async (item, tokenRes) => {
    const { token, key, domain, host } = tokenRes
    // const url = uploadURLFromRegionCode(region)
    try {
      const { data } = await Taro.uploadFile({
        url: host,
        filePath: item.url,
        name: 'file',
        formData:{
          'token': token,
          'key': key
      }})
      const imgData = JSON.parse(data)
      if (!imgData.key) {
        return false
      }
      return {
        url: `${domain}/${imgData.key}`
      }
    } catch (e) {
      throw new Error (e)
    }
  },
  localUpload: async (item, tokenRes) => {
    const { filetype, domain } = tokenRes
    const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
    try {
      const res = await Taro.uploadFile({
        url: `${req.baseURL}espier/uploadlocal`,
        filePath: item.url,
        name: 'images',
        formData:{
          name: filename,
          filetype
        }
      })
      const data = JSON.parse(res.data)
      const { image_url } = data.data
      if (!image_url) {
        return false
      }
      return {
        url: `${domain}/${image_url}`
      }
    } catch (e) {
      throw new Error (e)
    }
  },
  awsUpload: async (item, tokenRes) => {
    const {
      filetype,
      Region = 'cn-northwest-1',
      Bucket = 'wemall-media-dev',
      AccessKeyId = 'ASIA4MSC276FYEFHONOI',
      effectiveUri = 'https://wemall-media-dev.danielwellington.cn',
      SecretAccessKey = 'TKDlUPINVnBzy6LtXD9fkqHloCe2fxf6cnftSQkX',
      SessionToken = 'IQoJb3JpZ2luX2VjEAUaDmNuLW5vcnRod2VzdC0xIkgwRgIhALcp021bQYb9gkwivXyaT9bQ2ZAlcBDbO4Wwxfsv5o95AiEAziUCO0fqEGU1uq9UBz8/Pc2IEc0KgDifEEmnxmzuIfAq6wEIMxACGgw4NTE2MTc0NDc4MTkiDItbL+wnGY0uKKN0birIAbmP3onqD7U66YB0wtkVkLDMiCsWfNSpQqruvw07wq+Q/nhgeTlqtNlIKtoZgpmyN0F/Y65zcVsB/pW0LXdjcdLjBNziLMZLa58My6ulCHmS3uzcurqzmkIenLdDHgQHm+yYOir1cGvxxepcNQzKf+gkGQ+Gan/JGbNJz+l9yHQjANzJtEFPffUEXPBhwXeLQASPc5a7hK4bmU50lf3bD1Mwn+MlMcoQfkYxGtxnhFv/O8c8zc8LZcHIk/anNCILE07VdHWwoa61MIHwp/0FOpcBdsKoDWMjeM7SeyssWBzy2z0sIWCAzAX/zRtFcdMx76obTyNnV2A0YpjTfArshq7c//Po01J9Qn9KdL3iMnA52rSWlry3fPDa94WnX8mCFLBOyNMLn3wIsTpA8/lF6ztleIc1xSWyCg7PGsTCZL2gG52z9N89X4FMIFfgYVwRxAML2+k58f4ruVd6fFeQNf5qkf9tpn6lNQ=='      
    } = tokenRes
    const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
    try {
      const dateNow = new Date().toISOString()
      const dateNowRaw = dateNow.substr(0, dateNow.indexOf("T")).replace(/-/g, "")
      const res = await Taro.uploadFile({
        url: effectiveUri,
        filePath: item.url,
        name: 'file',
        formData:{
          acl: 'public-read',
          name: filename,
          key: '/key',
          Bucket,
          'x-amz-credential': `${AccessKeyId}/${dateNowRaw}/${Region}/s3/aws4_request`,
          policy: SecretAccessKey,
          'x-amz-algorithm': 'AWS4-HMAC-SHA256',
          Signature: SecretAccessKey,
          'x-amz-signature': SecretAccessKey,
          AWSAccessKeyId: AccessKeyId,
          filetype
        }
      })
      const data = JSON.parse(res.data)
      const { image_url } = data.data
      if (!image_url) {
        return false
      }
      return {
        url: ``
      }
    } catch (e) {
      throw new Error (e)
    }
  }
}

const getUploadFun = (dirver) => {
  const type = 'aws' || dirver
  switch (type) {
    case 'oss':
      return 'aliUpload'
    case 'local':
      return 'localUpload'
    case 'aws':
      return 'awsUpload'
    default:
      return 'qiNiuUpload'
  }
}

// 返回对应上传方式
const uploadImageFn = async (imgFiles, filetype = 'image') => {
  const { driver, token } = await getToken({ filetype })
  const uploadType = getUploadFun(driver)
  const imgs = []

  for (const item of imgFiles) {
    if (!item.file) {
      continue
    }
    try {
      const img = await upload[uploadType](item, { ...token, filetype})
      if (!img || !img.url) {
        continue
      }
      imgs.push(img)
    } catch (e) {
      console.log(e)
    }
  }
  return imgs
}

export default {
  uploadImageFn
}