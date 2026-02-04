import Taro from '@tarojs/taro'

const settingMap = {
  'getLocation': 'userLocation'
}

const apiActionFn = (apiName, apiParams) => {
  Taro[apiName](apiParams)
}

export const getLocation = (params) => {
  return new Promise((resolve, reject) => {
    apiActionFn('getLocation', {
      type: 'wgs84',
      ...params,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export const openSetting = () => {
  return new Promise((resolve, reject) => {
    Taro.openSetting({
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export const autoGetLocation = (params) => {
  return new Promise((resolve, reject) => {
    getSetting('getLocation')
      .then(() => {
        getLocation(params)
          .then((data) => {
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
      })
      .catch((err) => {
        openSetting().then((res) => {
          if (res.authSetting['scope.userLocation']) {
            console.log('-----------success opensetting')
            getLocation().then((res) => {
              resolve(res)
            })
          } else {
            console.log('-----------fail opensetting')
            reject()
          }
        })
      })
  })
}

export const getSetting = (source) => {
  return new Promise((resolve, reject) => {
    Taro.getSetting({
      success(res) {
        const { authSetting } = res
        const auth = authSetting[`scope.${settingMap[source]}`]
        if (auth === true || auth === undefined) {
          resolve()
        } else {
          reject({ containAction: 'openSetting' })
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}
