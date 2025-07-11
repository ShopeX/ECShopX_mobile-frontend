import Taro from '@tarojs/taro'
import api from '@/api'
import { useSelector, useDispatch } from 'react-redux'
import S from '@/spx'
import { pickBy, getDistributorId } from '@/utils'
import doc from '@/doc'
import { useLocation, useShopInfo } from '@/hooks'
import { updateShopInfo, changeInWhite } from '@/store/slices/shop'

export default ({ onPhoneCallComplete } = {}) => {
  const dispatch = useDispatch()
  const { open_divided_templateId } = useSelector((state) => state.sys)
  const { shopInfo } = useSelector((state) => state.shop)
  const { calculateDistance } = useLocation()
  const { location } = useSelector((state) => state.user)


  const checkStoreIsolation = async () => {
    const distributorId = getDistributorId() // 启动携带店铺id 或者 之前记录的 店铺信息
    if (!S.getAuthToken()) {
      if (typeof distributorId === 'undefined') {
        // 路由上没有店铺id，重定向到店铺引导页
        Taro.redirectTo({
          url: `/pages/custom/custom-page?id=${open_divided_templateId}&fromConnect=1`
        })
        return
      } else {
        const shopInfo = await api.shop.getShop({ distributor_id: distributorId })
        if (shopInfo.open_divided == '1') {
          // 登录
          Taro.showModal({
            content: '你还未登录，请先登录',
            confirmText: '立即登录',
            showCancel: false,
            success: async (res) => {
              debugger
              if (res.confirm) {
                try {
                  await login()
                  console.log('login 下面')
                } catch {
                  console.log('登录失败，走新用户注册')
                  if (loginRef.current && loginRef.current.handleToLogin) {
                    loginRef.current.handleToLogin()
                  }
                }
              }
            }
          })
        } else {
          // 进店
          dispatch(updateShopInfo(shopInfo))
          return
        }
      }
    } else {

    }
  }

  const handleSortShopList = (shopList) => {
    if (!shopList || !shopList.length) return null;

    // 复制数组以避免修改原数组
    const sortedShops = [...shopList].sort((a, b) => {
      // 确保 sort_id 存在，如果不存在则设置为 0
      const timeA = a.sort_id || 0;
      const timeB = b.sort_id || 0;
      // 降序排序，最新的在前
      return timeB - timeA;
    });

    return sortedShops;
  }

  // 找到创建时间最晚的白名单店铺
  const findLatestCreatedShop = (shopList) => {
    if (!shopList || !shopList.length) return null;
    return handleSortShopList(shopList)[0];
  };

  // 排序店铺
  const sortShopList = (shopList) => {
    if (!shopList || !shopList.length) return null;
    return handleSortShopList(shopList);
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
    const latestShop = findLatestCreatedShop(shopList);
    return latestShop;
    // }



  }

  // 打店铺电话
  // todozm 修改逻辑，如果没落地页模版id，弹窗打电话，有模版id的话，没有携带店铺id，自动跳，带了 店铺id ，还是需要弹窗
  const connectWhiteShop = (phone) => {
    if (open_divided_templateId) {
      const query = `?id=${open_divided_templateId}&fromConnect=1`
      const path = `/pages/custom/custom-page${query}`
      Taro.navigateTo({
        url: path
      })
    } else {
      Taro.makePhoneCall({
        phoneNumber: phone,
        complete: () => {
          // 在电话操作完成后（无论成功或失败）执行
          if (onPhoneCallComplete) {
            onPhoneCallComplete()
          }
        }
      })
    }
  }

  const phoneCall = (phone) => {
    Taro.makePhoneCall({
      phoneNumber: phone,
      complete: () => {
        // 在电话操作完成后（无论成功或失败）执行
        if (onPhoneCallComplete) {
          onPhoneCallComplete()
        }
      }
    })
  }

  // 没有店铺
  // const showNoShopModal = (phone) => {
  //   Taro.showModal({
  //     content: '抱歉，本店会员才可以访问，如有需要可电话联系店铺',
  //     confirmText: '关闭',
  //     cancelText: '联系店铺',
  //     showCancel: !!(open_divided_templateId || phone),
  //     success: async (res) => {
  //       if (res.cancel) {
  //         connectWhiteShop(phone)
  //       }

  //       if (res.confirm) {
  //         // 关闭退出小程序
  //         Taro.exitMiniProgram()
  //       }
  //     }
  //   })
  // }


  return {
    checkStoreIsolation,
    connectWhiteShop,
    findLatestCreatedShop,
    getWhiteShop,
    phoneCall,
    sortShopList
  }
}
