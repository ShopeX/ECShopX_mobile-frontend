import Taro from '@tarojs/taro'
import api from '@/api'
import { useSelector, useDispatch } from 'react-redux'
import S from '@/spx'
import { pickBy } from '@/utils'
import doc from '@/doc'
import { useLocation, useShopInfo } from '@/hooks'

export default (props) => {
  const dispatch = useDispatch()
  const { initState, openRecommend, openLocation, openStore, appName, openScanQrcode, open_divided, open_divided_templateId } =
    useSelector((state) => state.sys)
  const { shopInfo } = useSelector((state) => state.shop)
  const { calculateDistance } = useLocation()
  const { location } = useSelector((state) => state.user)
  // 找到最近的白名单店铺
  const findNearestWhiteListShop = (shopList, currentLocation) => {
    if (!shopList || !shopList.length || !currentLocation) return null;

    // 先筛选同城市的店铺
    let filteredShops = shopList.filter(shop =>
      shop.regions &&
      shop.regions[0] === currentLocation.province &&
      shop.regions[1] === currentLocation.city &&
      shop.regions[2] === currentLocation.district
    );

    // 如果没有同城市的店铺，返回所有店铺中最近的
    if (filteredShops.length === 0) {
      filteredShops = shopList;
    }

    // 计算每个店铺的距离
    const shopsWithDistance = filteredShops.map(shop => {
      const distance = calculateDistance(
        parseFloat(currentLocation.lat),
        parseFloat(currentLocation.lng),
        parseFloat(shop.lat),
        parseFloat(shop.lng)
      );
      return {
        ...shop,
        distance
      };
    });

    // 按距离排序
    shopsWithDistance.sort((a, b) => a.distance - b.distance);

    return shopsWithDistance[0];
  };

  // 找到创建时间最晚的白名单店铺
  const findLatestCreatedShop = (shopList) => {
    if (!shopList || !shopList.length) return null;

    // 复制数组以避免修改原数组
    const sortedShops = [...shopList].sort((a, b) => {
      // 确保 created 存在，如果不存在则设置为 0
      const timeA = a.created || 0;
      const timeB = b.created || 0;
      // 降序排序，最新的在前
      return timeB - timeA;
    });

    return sortedShops[0];
  };

  const getWhiteShop = async () => {
    // 获取店铺列表，主要用于查找白名单店铺
    const fetchShop = async () => {
      let params = {
        page: 1,
        pageSize: 50,
        type: 0,           // 店铺类型，0表示所有类型
        search_type: 2,    // 1=搜索商品；2=搜索门店
        sort_type: 1,      // 排序方式
        show_type: 'self'  // 'self'表示只获取白名单店铺
      }

      // console.log(`fetchShop query: ${JSON.stringify(params)}`)
      // 调用店铺列表API
      const { list } = await api.shop.list(params)
      // 使用 pickBy 函数按照 doc.shop.SHOP_ITEM 的格式处理店铺数据
      const reslut = pickBy(list, doc.shop.SHOP_ITEM)
      console.log("🚀🚀🚀 ~ fetchShop ~ list:", reslut)
      return reslut
    }

    // 获取用户已经加入的白名单店铺，筛选合适的店铺
    const shopList = await fetchShop()
    // 找到最近的白名单店铺
    if (location) {
      const nearestShop = findNearestWhiteListShop(shopList, location);
      if (nearestShop) {
        // 使用最近的白名单店铺信息
        return nearestShop;
      }
    } else {
      // 找到创建时间最晚的白名单店铺
      const latestShop = findLatestCreatedShop(shopList);
      if (latestShop) {
      }
      return latestShop;
    }



  }

  // 联系店铺
  const connectWhiteShop = () => { 
    if (open_divided_templateId) {
      const query = `?id=${open_divided_templateId}`
      const path = `/pages/custom/custom-page${query}`
      Taro.navigateTo({
        url: path
      })
    } else {
      Taro.makePhoneCall({
        phoneNumber: shopInfo.phone
      })
    }
  }

  // 没有店铺
  const showNoShopModal = () => {
    Taro.showModal({
      content: '抱歉，本店会员才可以访问，如有需要可电话联系店铺',
      confirmText: '关闭',
      cancelText: '联系店铺',
      showCancel: !!(open_divided_templateId || shopInfo?.phone),
      success: async (res) => {
        if (res.cancel) {
          connectWhiteShop()
        }

        if (res.confirm) {
          // 关闭退出小程序
          Taro.exitMiniProgram()
        }
      }
    })
  }


  return { findNearestWhiteListShop, findLatestCreatedShop, getWhiteShop, showNoShopModal, connectWhiteShop }
}
