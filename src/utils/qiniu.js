import Taro from "@tarojs/taro";
import req from '@/api/req'
import * as qiniu from 'qiniu-js'
import log from "./log";

async function uploadImageFn (imgFiles, getUrl, curFilesystem, curFiletype) {
  let promises = []
  console.log(888)

  for (let item of imgFiles) {
    const promise = new Promise(async (resolve, reject) => {
      if (!item.file) {
        resolve(item)
      } else {
        const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
        const { region, token, key, domain } = await req.get(getUrl, {
          filesystem: curFilesystem,
          filetype: curFiletype,
          filename
        })
        let uploadUrl = uploadURLFromRegionCode(region)
        if (process.env.TARO_ENV === 'weapp') {
          Taro.uploadFile({
            url: uploadUrl,
            filePath: item.url,
            name: 'file',
            formData:{
              'token': token,
              'key': key
            },
            success: res => {
              let imgData = JSON.parse(res.data)
              resolve({
                url: `${domain}/${imgData.key}`
              })
            },
            fail: error => reject(error)
          })
        } else {
          let observable
          try {
            const blobImg = await resolveBlobFromFile(item.url, item.file.type)
            observable = qiniu.upload(blobImg, key, token, {}, {
              region: qiniu.region[region]
            })
          } catch (e) {
            console.log(e)
          }

          observable.subscribe({
            next (res) {},
            error (err) {
              reject(err)
            },
            complete (res) {
              resolve({
                url: `${domain}/${res.key}`
              })
            }
          })
        }

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
