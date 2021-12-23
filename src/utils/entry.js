import Taro,{getCurrentInstance} from "@tarojs/taro";
import api from "@/api";
import req from "@/api/req";
import S from "@/spx";
import { getOpenId } from '@/utils/youshu'
import { payTypeField } from '@/utils'
import entryLaunchFun from '@/utils/entryLaunch'
import qs from 'qs'

// 请在onload 中调用此函数，保证千人千码跟踪记录正常
// 用户分享和接受参数处理
async function entryLaunch(data, isNeedLocate, privacy_time) {
  let options = null
  if (data.scene) {
    const scene = decodeURIComponent(data.scene);
    //格式化二维码参数
    options = parseUrlStr(scene);  
  } else {
    options = data;
  }
  console.log('[entry-options]',options) 
  
  // 如果没有带店铺id
  if (!options.dtid) {
    let { distributor_id, store_id } = Taro.getStorageSync("curStore");
    if (distributor_id) {
      options.dtid = options.isStore ? store_id : distributor_id;
    }
  }
  let dtidValid = false;
  let store = {};

  // 传过来的店铺id
  if (options.dtid) {
    store = await handleDistributorId(options.dtid);
    dtidValid = store.status ? false : true;
  }


  // 如果需要定位,并且店铺无效，
  // if (!dtidValid) { 
  store = await getLocal(isNeedLocate, privacy_time)
  // }

  if (!store.status) {
    options.store = store;
    options.dtid = store.distributor_id;
  }

  if (options.uid) {
    // 如果分享带了会员ID 那么
    Taro.setStorageSync("distribution_shop_id", options.uid);
    Taro.setStorageSync("trackParams", {});
  } else if (options.s && options.m) {
    Taro.setStorageSync("distribution_shop_id", "");
    Taro.setStorageSync("trackParams", {
      source_id: options.s,
      monitor_id: options.m
    });
    trackViewNum(options.m, options.s);
  }

  let emp_id = options.emp_id || data.emp_id || options.emp || data.emp; //导购ID
  let gu = options.gu;
  let share_chatId = options.share_chatId;
  let entrySource = options.entrySource;
  let entrytime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; //过期时间

  if (emp_id) {
    if (emp_id !== "undefined" && emp_id !== "") {
      console.log("emp_id---9999", emp_id);

      Taro.setStorageSync("caodongParams", {
        emp: emp_id,
        entrytime: entrytime
      });

      if (Taro.getStorageSync("token")) {
        api.track.salesmenlog({ omc_id: emp_id });
      }
    }
  }
  /**
   * 我的云店跳转到导购货架：携带参数：gu=导购编号_门店 ====》导购转发分享携带参数gu=导购编号_门店
   * 线上导购：（1）企业微信群聊天的工具栏跳转到导购货架：导购转发分享携带参数gu=导购编号_门店&share_chatId=群ID
   *          (2）企业微信个人聊天的工具栏跳转到导购货架：导购转发分享携带参数gu=导购编号_门店
   * 线下导购：扫码导购码，码参数gu=导购编号
   *
   * 流程：把企业微信群id（qw_chatId）通过导购货架小程序分享出去，商城小程序接收到分享的群id（share_chatId）缓存起来，然后下单的时候带上群ID
   * **/
  if (gu) {
    let guide_p = gu.split("_");
    let guide_code = guide_p[0];
    let store_code = guide_p[1];
    await S.delete("ba_params", true); //删除缓存的导购信息，新的进行替换
    await S.delete("qw_chatId", true); //删除缓存的企业微信群id，新的进行替换
    await S.delete("share_chat", true); //删除缓存的分享群id，新的进行替换
    await S.delete("entry_source", true); //删除缓存的导购入口来源，新的进行替换
    let ba_info = null;
    // if (S.getAuthToken()) {
    //   ba_info = await api.user.getGuideInfo({
    //     guide_code: guide_code,
    //     wxshop_bn: store_code || ""
    //   });
    // }

    if (share_chatId) {
      S.set(
        "share_chat",
        {
          share_chatId,
          entrytime
        },
        true
      );
    }
    if (entrySource) {
      S.set(
        "entry_source",
        {
          entrySource,
          entrytime
        },
        true
      );
    }
    S.set(
      "ba_params",
      {
        //缓存c端的导购信息，c端的导购信息有过期时间7天
        guide_code,
        store_code,
        ba_info,
        entrytime
      },
      true
    );
  }
  /** 如果有场景值记录日志 */
  await logScene(data);

  return options;
}

async function logScene(data){
    if(data.scene){
      //扫码进来时
      let logParams={}
      const scene = decodeURIComponent(data.scene);
      //格式化二维码参数
      logParams = parseUrlStr(scene); 
      const resIds=await getOpenId();
      logParams={
        ...logParams,
        ...resIds,
        ...({storageUid:Taro.getStorageSync("distribution_shop_id")}),
        type:'in'
      }
      console.log("【logParams】",logParams)
      await api.promotion.logQrcode(logParams)
    }
    if(data.register){
      //当用户注册时
      let logParams={}
      const resIds=await getOpenId();
      logParams={
        ...({type:'register'}),
        ...resIds,
        ...({storageUid:Taro.getStorageSync("distribution_shop_id")})
      }
      console.log("【logParams】",logParams)
      await api.promotion.logQrcode(logParams)
    }
}
 
async function getLocalSetting() {
  const paramsurl=qs.stringify(payTypeField)
  const url = `/pagestemplate/setInfo?${paramsurl}`;
  const { is_open_wechatapp_location } = await req.get(url);
  if (is_open_wechatapp_location == 1) {
    return true;
  } else {
    return false;
  }
  // return true
}

//   store = {
//     distributor_id:0
//   }
//   Taro.setStorageSync('curStore', store)
async function getLocal(isNeedLocate, privacy_time) {
  let store = null
  const positionStatus = await getLocalSetting()
  if (!positionStatus) {
    store = await api.shop.getShop();
  } else {
    let lnglat = Taro.getStorageSync("lnglat");
    if (lnglat) {
      let param = {};
      if (isNeedLocate && positionStatus) {
        param.lat = lnglat.lat;
        param.lng = lnglat.lng;
      }
      store = await api.shop.getShop(param);
    } else {
      let locationData = null
      if (String(privacy_time)) {
        locationData = await entryLaunchFun.getLocationInfo()
        if (locationData.lat) await InverseAnalysisGaode(locationData)
      }
      // const locationData = await getLoc()
      if (locationData !== null && locationData !== '') {
        let param = {}
        if (isNeedLocate && positionStatus) {
          param.lat = locationData.lat;
          param.lng = locationData.lng;
        }
        store = await api.shop.getShop(param);
      } else {
        store = await api.shop.getShop();
      }
    }
  }
  if (!store.status) {
    // 新增逻辑，如果开启了非门店自提流程，新增字段,开启非门店自提流程，所有的distribution_id 取值为0，store_id
    store.store_id = 0;
    Taro.setStorageSync("curStore", store);
  } else {
    Taro.setStorageSync("curStore", []);
  }

  return store;
}

async function getLoc() {
  if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
    return await Taro.getLocation({ type: 'gcj02' }).then(
      async (locationData) => {
        await InverseAnalysisGaode(locationData)
        // await InverseAnalysis(locationData)
        return locationData
      },
      () => {
        return null;
      }
    );
  } else {
    // if (process.env.APP_PLATFORM === 'standard') {
    // return getWebLocal().catch(() => '定位错误')
    // } else {
    //   return null
    // }
  }
}

async function getStoreStatus() {
  const { nostores_status } = Taro.getStorageSync("otherSetting");
  // if (process.env.APP_PLATFORM === "standard") {
    if ("standard") {
    if (nostores_status === true) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// web定位获取
// function getWebLocal(isSetStorage = true) {
//   const { qq } = window
//   // let geolocation = new qq.maps.Geolocation('PVUBZ-E24HK-7SXJY-AGQZC-DN3IT-6EB6V', 'oneX新零售门店定位')
//   let geolocation = new qq.maps.Geolocation(process.env.APP_MAP_KEY, process.env.APP_MAP_NAME)
//   return new Promise((resolve, reject) => {
//     geolocation.getLocation(
//       (r) => {
//         console.log('您的位置：' + r.lng + ',' + r.lat)
//         const param = {
//           latitude: r.lat,
//           longitude: r.lng
//         }
//         if (isSetStorage) {
//           Taro.setStorage({ key: 'lnglat', data: param })
//         }
//         resolve(param)
//       },
//       () => {
//         console.log('定位失败')
//         Taro.showToast({
//           icon: 'none',
//           title: '定位失败'
//         })
//         reject('')
//       },
//       {
//         timeout: 3000
//       }
//     )
//   })
// }
// 新增千人千码跟踪记录
function trackViewNum(monitor_id, source_id) {
  let _session = Taro.getStorageSync("_session");
  if (!_session) {
    return true;
  }

  if (monitor_id && source_id) {
    let param = { source_id: source_id, monitor_id: monitor_id };
    api.track.viewnum(param);
  }
  return true;
}

// distributorId 店铺ID
async function handleDistributorId(distributorId) {
  const res = await api.shop.getShop({ distributor_id: distributorId });
  //const isOpenStore = await getStoreStatus()
  if (res.status === false) {
    // 新增逻辑，如果开启了非门店自提流程，新增字段,开启非门店自提流程，所有的distribution_id 取值为0，store_id
    res.store_id = 0;
    Taro.setStorageSync("curStore", res);
  } else {
    Taro.setStorageSync("curStore", []);
  }
  return res;
}

// 格式化URL字符串
function parseUrlStr(urlStr) {
  var keyValuePairs = [];
  if (urlStr) {
    for (var i = 0; i < urlStr.split("&").length; i++) {
      keyValuePairs[i] = urlStr.split("&")[i];
    }
  }
  var kvObj = [];
  for (var j = 0; j < keyValuePairs.length; j++) {
    var tmp = keyValuePairs[j].split("=");
    kvObj[tmp[0]] = decodeURI(tmp[1]);
  }
  return kvObj;
}

// 逆解析地址
// async function InverseAnalysis(locationData) {
//   const { latitude, longitude } = locationData
//   let cityInfo = await Taro.request({
//     url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${process.env.APP_MAP_KEY}`
//   })
//   if (cityInfo.data.result) {
//     Taro.setStorageSync('lnglat', {
//       ...locationData,
//       ...cityInfo.data.result.address_component
//     })
//   }
// }

// 高德地图根据地址解析经纬度
async function positiveAnalysisGaode (locationData) {
  // let MAP_KEY = null
  // if (process.env.TARO_ENV === 'weapp') {
  //   const { map_key } = Taro.getExtConfigSync ? Taro.getExtConfigSync() : {}
  //   MAP_KEY = map_key
  // } else {
  //   MAP_KEY = Taro.getStorageSync('gaode_map_key') || {}
  // }
  const { addressdetail: address } = locationData
  let cityInfo = await Taro.request({
    url: `https://restapi.amap.com/v3/geocode/geo`,
    data:{
      key: process.env.APP_MAP_KEY,
      address,
    }
  })
  if (cityInfo.data.status == 1) {
    const { geocodes } = cityInfo.data
    Taro.setStorageSync('lnglat', {
      ...geocodes[0],
      lng: +geocodes[0].location.split(',')[0],
      lat: +geocodes[0].location.split(',')[1],
      addressdetail: geocodes[0].formatted_address
    })
    Taro.eventCenter.trigger('lnglat-success')
  }
}

// 高德地图根据经纬度解析地址
async function InverseAnalysisGaode(locationData){
  // let MAP_KEY = null
  // if (process.env.TARO_ENV === 'weapp') {
  //   const { map_key } = Taro.getExtConfigSync ? Taro.getExtConfigSync() : {}
  //   MAP_KEY = map_key
  // } else {
  //   MAP_KEY = Taro.getStorageSync('gaode_map_key') || {}
  // }
  const { lat, lng } = locationData
  let cityInfo = await Taro.request({
    url: `https://restapi.amap.com/v3/geocode/regeo`,
    data:{
      key: process.env.APP_MAP_KEY,
      location:`${lng},${lat}`, 
    }
  }); 
  console.log("===cityInfowjb2===>",cityInfo,process.env.APP_MAP_KEY,locationData,process.env)
  if (cityInfo.data.status == 1) {
    Taro.setStorageSync('lnglat', {
      ...locationData,
      ...cityInfo.data.regeocode.addressComponent,
      addressdetail: cityInfo.data.regeocode.formatted_address
    } );
    Taro.eventCenter.trigger('lnglat-success')
  }
}

export default {
  entryLaunch,
  getLocal,
  getLoc,
  getLocalSetting,
  // getWebLocal,
  // InverseAnalysis,
  InverseAnalysisGaode,
  positiveAnalysisGaode,
  getStoreStatus,
  logScene
};
