import Taro from "@tarojs/taro";
import req from '@/api/req'

// 请在onload 中调用此函数，保证千人千码跟踪记录正常
// 用户分享和接受参数处理
async function handleShareOptions(data, isNeedLocate) {
  var options
  if (data.scene) {
    var scene = decodeURIComponent(data.scene)
    //格式化二维码参数
    options = parseUrlStr(scene)
  } else {
	  console.log('share data',data)
    options = data
  }
  console.log('分享带过来的参数', options)

  // 如果没有带店铺id
  if (!options.dtid) {
    let trackIdentity = Taro.getStorageSync('trackIdentity')
    if (trackIdentity.distributor_id) {
      options.dtid = trackIdentity.distributor_id
    }
  }
  var dtidValid = false
  var distributor = {}
  if (options.dtid) {
    distributor = await handleDistributorId(options.dtid)
    dtidValid = distributor.status ? false : true
  }

  console.log('是否需要定位', dtidValid)

  // 如果需要定位,并且店铺无效，
  if (!dtidValid) {
    console.log('进行定位处理')
    distributor = await getLocal(isNeedLocate)
  }

  console.log('定位或返回值', distributor)

  options.distributor = false
  if (distributor.status === false) {
    options.distributor = distributor
    options.dtid = distributor.distributor_id
    Taro.setStorageSync('currentShopName', distributor.name)
  }

  if (options.uid) {
    // 如果分享带了会员ID 那么
    Taro.setStorageSync('uid', options.uid)
    Taro.setStorageSync('trackParams', {})
  } else if (options.s && options.m) {
    Taro.setStorageSync('uid', '')
    Taro.setStorageSync('trackParams', {source_id: options.s, monitor_id: options.m})
    trackViewNum(options.m, options.s)
  }
  console.log('接收出来后参数', options)
  return options
}

//获取定位配置
async function getLocalSetting() {
  var filter = {template_name: 'yykweishop', version: 'v1.0.1', name: 'setting'}
  var positionStatus = await http.action(api.template.pageparams, filter, true).then(res => {
    if (res.data.data.length > 0) {
      var data = res.data.data[0].params
      if (!data || !data.config) {
        return true
      } else if(data.config.location){
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  })
  return positionStatus
}

async function getLocal (isNeedLocate) {
  var positionStatus = await getLocalSetting()
  if (!positionStatus) {
    var param = {}
    var distributor = await http.action(api.cash.distributorIsValid, param, true).then(res => {
      return res.data.data
    })
  } else {
    let lnglat = Taro.getStorageSync('lnglat')
    if (lnglat) {
      var param = {}
      if (isNeedLocate && positionStatus) {
        param.lat = lnglat.latitude
        param.lng = lnglat.longitude
      }
      var distributor = await http.action(api.cash.distributorIsValid, param, true).then(res => {
        return res.data.data
      })
    } else {
      var locationData = await getLoc()
      if (locationData !== '') {
        var param = {}
        if (isNeedLocate && positionStatus) {
          param.lat = locationData.latitude
          param.lng = locationData.longitude
        }
        var distributor = await http.action(api.cash.distributorIsValid, param, true).then(res => {
          return res.data.data
        })
      } else {
        var distributor = {}
      }
    }
  }

  if (distributor.status === false) {
    Taro.setStorageSync('trackIdentity', {distributor_id: distributor.distributor_id})
  } else {
    Taro.setStorageSync('trackIdentity', false)
  }
  return distributor
}

async function getLoc () {
  return await Taro.getLocation({type: 'gcj02'}).then(locationData => {
    Taro.setStorage({ key: 'lnglat', data: locationData })
    return locationData
  }, res => {
    return ''
  })
}

// 新增千人千码跟踪记录
function trackViewNum (monitor_id, source_id) {
  let _session = Taro.getStorageSync('_session')
  if (!_session) {
    return true
  }

  if (monitor_id && source_id) {
    let param = {source_id: source_id, monitor_id: monitor_id}
    http.action(api.track.viewnum, param)
  }
  return true
}

// distributorId 店铺ID
function handleDistributorId(distributorId) {
  return http.action(api.cash.distributorIsValid, {distributor_id: distributorId}, true).then(res => {
    // 是否需要定位，false则表示有效，不需要定位
    if (res.data.data.status === false) {
      Taro.setStorageSync('trackIdentity', {distributor_id: distributorId})
    } else {
      Taro.setStorageSync('trackIdentity', '')
    }
    return res.data.data
  })
}

// 格式化URL字符串
function parseUrlStr (urlStr) {
  var keyValuePairs = []
  if (urlStr) {
    for (var i = 0; i < urlStr.split('&').length; i++) {
      keyValuePairs[i] = urlStr.split('&')[i]
    }
  }
  var kvObj = []
  for (var j = 0; j < keyValuePairs.length; j++) {
    var tmp = keyValuePairs[j].split('=')
    kvObj[tmp[0]] = decodeURI(tmp[1])
  }
  return kvObj
}

export default {
  handleShareOptions
}
