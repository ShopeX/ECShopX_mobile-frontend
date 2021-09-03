/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/utils/upload.js
 * @Date: 2020-03-06 16:32:07
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-16 17:42:43
 */
import Taro from '@tarojs/taro'
import req from '@/api/req'
import S from '@/spx'
import { isAlipay } from '@/utils'
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
    const { accessid, dir, host, policy, signature } = tokenRes
    const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
    try {
      const res = await Taro.uploadFile({
        url: host,
        filePath: item.url,
        name: 'file',
        formData: {
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
      throw new Error(e)
    }
  },
  qiNiuUpload: async (item, tokenRes) => {
    const { token, key, domain, host } = tokenRes 
    
    const uploadFile = isAlipay ? my.uploadFile : Taro.uploadFile;
  
    try {
      const { data } = await uploadFile({
        url: host,
        filePath: item.url,
        fileType:'image',
        [isAlipay?'fileName':'name']: 'file',
        formData:{
          'token': token,
          'key': key
        }
      })
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
    const { filetype = "image", domain } = tokenRes
    const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
    const extConfig = Taro.getExtConfigSync ? Taro.getExtConfigSync() : {}
    try {
      const res = await Taro.uploadFile({
        url: `${req.baseURL}espier/uploadlocal`,
        filePath: item.url,
        header: {
          'Authorization': `Bearer ${S.getAuthToken()}`,
          'authorizer-appid': extConfig.appid
        },
        name: 'images',
        formData: {
          name: filename,
          filetype,
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
      throw new Error(e)
    }
  },
  awsUpload: async (item, tokenRes) => {
    const {
      formInputs = {
        XAmzCredential: '',
        XAmzAlgorithm: '',
        XAmzDate: '',
        Policy: '',
        XAmzSignature: '',
        key: ''
      },
      formAttributes = {
        action: ''
      }
    } = tokenRes
    try {
      const res = await Taro.uploadFile({
        url: formAttributes.action,
        filePath: item.url,
        name: 'file',
        formData: {
          key: formInputs.key,
          'X-Amz-Credential': formInputs.XAmzCredential,
          'X-Amz-Algorithm': `AES256`,
          Policy: formInputs.Policy,
          'X-Amz-Algorithm': formInputs.XAmzAlgorithm,
          'X-Amz-Date': formInputs.XAmzDate,
          'X-Amz-Signature': formInputs.XAmzSignature
        }
      })

      const { Location } = res.header
      if (!Location) {
        return false
      }
      return {
        url: Location
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}

const getUploadFun = (dirver) => {
  switch (dirver) {
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
  console.log("---imgFiles---", imgFiles)
  const imgs = []
  for (const item of imgFiles) {
    if (!item.file) {
      if (item.url) {
        imgs.push(item)
      }
      continue
    }
    try {
      const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
      const { driver, token } = await getToken({ filetype, filename })
      const uploadType = getUploadFun(driver)
      console.log("----uploadType----", uploadType)
      const img = await upload[uploadType](item, { ...token, filetype })
      if (!img || !img.url) {
        continue
      }
      imgs.push(img)
    } catch (e) {
      console.log(e)
    }
  }
  console.log("---uploadImageFn---", imgs)
  return imgs
}

export default {
  uploadImageFn
}