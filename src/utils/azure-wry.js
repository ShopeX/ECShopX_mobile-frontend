import Taro from '@tarojs/taro'
import req from '@/api/req'
import S from '@/spx'

async function uploadImagesFn(imgFiles) {
  let promises = []
  imgFiles.forEach((item) => {
    const promise = new Promise((resolve, reject) => {
      if (!item.file) {
        resolve(item)
      } else {
        const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
        const extConfig = Taro.getExtConfigSync ? Taro.getExtConfigSync() : {}
        Taro.uploadFile({
          url: req.baseURL + 'espier/upload',
          filePath: item.url,
          name: 'file',
          header: {
            'Authorization': S.getAuthToken(),
            'authorizer-appid': extConfig.appid
          },
          formData: {
            'file': item.url,
            'company_id': extConfig.company_id || APP_COMPANY_ID
          },
          success: (res) => {
            let imgData = JSON.parse(res.data)
            resolve(imgData.data)
          },
          fail: (error) => reject(error)
        })
      }
    })
    promises.push(promise)
  })

  let results = await Promise.all(promises)

  return results
}

export default {
  uploadImagesFn
}
