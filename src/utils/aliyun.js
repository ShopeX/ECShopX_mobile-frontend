/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 阿里云图片上传
 * @FilePath: /ossVshop/src/utils/aliyun.js
 * @Date: 2020-03-04 13:51:30
 * @LastEditors: Arvin
 * @LastEditTime: 2020-03-13 12:35:03
 */
import Taro from "@tarojs/taro";
import req from '@/api/req'

async function uploadImageFn (imgFiles, getUrl, curFiletype, region) {
  let promises = []
  for (let item of imgFiles) {
    const promise = new Promise(async (resolve, reject) => {
      if (!item.file) {
        resolve(item)
      } else {
        const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
        const {accessid, callback, dir, host, policy, signature} = await req.get(getUrl, {
          filesystem: 'ali',
          filetype: curFiletype,
          filename
        })
          Taro.uploadFile({
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
              success_action_status: '200'
              // 服务端回调
              // callback: ''
            },
            success: res => {
              // let imgData = JSON.parse(res.data)
              console.log(res)
              resolve({
                url: `${host}${dir}`
              })
            },
            fail: error => reject(error)
          })
      }
    })
    promises.push(promise)
  }

  let results = await Promise.all(promises)

  return results
}

function resolveBlobFromFile (url, type) {
  return fetch(url)
    .then(res => res.blob())
    .then(blob => blob.slice(0, blob.size, type))
}

const getPolicy = function () {
  let date = new Date();
  date.setHours(date.getHours() + env.timeout);
  let expire = date.toISOString();
  const policy = {
    "expiration": expire, // 设置该Policy的失效时间
    "conditions": [
      ["content-length-range", 0, 3 * 1024 * 1024] // 设置上传文件的大小限制
    ]
  };

  return Base64.encode(JSON.stringify(policy));
}

const getSignature = function (policyBase64) {
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, env.AccessKeySecret, {
    asBytes: true
  });
  return Crypto.util.bytesToBase64(bytes);
}

function uploadURLFromRegionCode(code) {
    let uploadURL = null;
    switch(code) {
        case 'z0': uploadURL = 'https://up.qiniup.com'; break;
        case 'z1': uploadURL = 'https://up-z1.qiniup.com'; break;
        case 'z2': uploadURL = 'https://up-z2.qiniup.com'; break;
        case 'na0': uploadURL = 'https://up-na0.qiniup.com'; break;
        case 'as0': uploadURL = 'https://up-as0.qiniup.com'; break;
        default: console.error('please make the region is with one of [z0, z1, z2, na0, as0]');
    }
    return uploadURL;
}

// module.export = {
//   uploadImageFn: uploadImageFn,
// }

export default {
  uploadImageFn
}
