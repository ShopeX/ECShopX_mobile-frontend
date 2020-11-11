/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/utils/upload.js
 * @Date: 2020-03-06 16:32:07
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-11 15:10:22
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
      AccessKeyId = 'AKIA4MSC276F5NBR4P7G',
      effectiveUri = 'https://wemall-media-dev.s3.cn-northwest-1.amazonaws.com.cn',
      SecretAccessKey = 'ae2475d6ec150e9f9e0d229a0de8d8bd2b3a7136fa434c1809fb6d6d77532398'    
    } = tokenRes
    const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
    try {
      // const dateNow = new Date().toISOString()
      // const dateNowRaw = dateNow.substr(0, dateNow.indexOf("T")).replace(/-/g, "")
      const res = await Taro.uploadFile({
        url: effectiveUri,
        filePath: item.url,
        name: 'file',
        formData:{
          acl: 'public-read',
          name: filename,
          key: '/key',
          'X-Amz-Credential': `AKIA4MSC276F5NBR4P7G/20201111/cn-northwest-1/s3/aws4_request`,
          'X-Amz-Algorithm': `AES256`,
          Policy: 'eyJleHBpcmF0aW9uIjoiMjAyMC0xMS0xMVQwODowNTowOFoiLCJjb25kaXRpb25zIjpbeyJhY2wiOiJwdWJsaWMtcmVhZCJ9LHsiYnVja2V0Ijoid2VtYWxsLW1lZGlhLWRldiJ9LFsic3RhcnRzLXdpdGgiLCIka2V5IiwidXNlclwvZXJpY1wvIl0seyJYLUFtei1EYXRlIjoiMjAyMDExMTFUMDYwNTA4WiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFLSUE0TVNDMjc2RjVOQlI0UDdHXC8yMDIwMTExMVwvY24tbm9ydGh3ZXN0LTFcL3MzXC9hd3M0X3JlcXVlc3QifSx7IlgtQW16LUFsZ29yaXRobSI6IkFXUzQtSE1BQy1TSEEyNTYifV19',
          'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
          'X-Amz-Date': '20201111T060508Z',
          'X-Amz-Signature': '010426c3b78fa354995a869987c5b4b916913a2f4e4ee300123daad9b1fedca'
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