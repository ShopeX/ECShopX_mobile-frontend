/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 社区团购api
 * @FilePath: /unite-vshop/src/api/groupBy.js
 * @Date: 2020-05-26 10:23:49
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-16 14:09:13
 */ 
import req from './req'
import { transformPlatformUrl } from '@/utils'

// 登录
export const login = (param = {}) => req.post('/wxa/promotion/articles', param)

// 获取信息
export const info = (param = {}) => req.get('/member', param)
// export const info = (param = {}) => req.get('/userinfo', param)

// identity
export const identity = (param = {}) => req.get('/distributor', param)

// 获取模版
export const getTemplate = (param = {}) => req.get(transformPlatformUrl('/alipay/pageparams/setting'), param)

// promotionArticles
export const promotionArticles = (param = {}) => req.get('/promotion/articles', param)

// promotionArticlesInfo
export const promotionArticlesInfo = (param = {}) => req.get('/wxa/promotion/articles/info', param)

// showMemberCode
export const showMemberCode = (param = {}) => req.get('/barcode', param)

// 获取店铺设置
export const getCompanySetting = (param = {}) => req.get('/company/setting', param)

// 获取分类列表
export const getCategoryList = (param = {}) => req.get('/goods/category', param)

// 获取购物车数据
export const getCart = (param = {}) => req.get('/cart', param)

// 更新购物车
export const updateCart = (param = {}) => req.post('/cart', param)

// 更新商品数量
export const updateGoodNum = (param = {}) => req.put('/cartupdate/num', param)

// 更新商品选中状态
export const updateCheckGood = (param = {}) =>  req.put('/cartupdate/checkstatus', param)

// 删除商品
export const deleteGood = (param = {}) => req.delete('/cartdel', param)

// 会员注册设置
export const registerSetting = (param = {}) => req.get('/member/setting', param)

// 会员信息
export const memeberInfo = (param = {}) => req.get('/member', param)

// 会员注册
export const memberRegister = (param = {}) => req.post('/member', param)

// decryptPhoneNumber
export const decryptPhoneNumber = (param = {}) => req.get('/member/decryptPhoneInfo', param)

// receiveVip
export const receiveVip = (param = {}) => req.get('/promotion/getMemberCard', param)

// card列表
export const getCardList = (param = {}) => req.get('/getCardList', param)

// userCardList
export const getUserCardList = (param = {}) => req.get('/user/newGetCardList', param)

// receiveCard
export const receiveCard = (param = {}) => req.get('/user/effectiveCardlist', param)

// getCardDetail
export const getCardDetail = (param = {}) => req.get('/user/getCardDetail', param)

// useUserCard
export const useUserCard = (param = {}) => req.get('/user/usedCard', param)

// 支付设置
export const payConfig = (param = {}) => req.get('/payment/config', param)

// 门店列表
export const getStoreList = (param = {}) => req.get('/distributor/list', param)

// 店铺列表
export const getShopList = (param = {}) => req.get('/shops/wxshops', param)

// 附近店铺列表
export const getNearShop = (param = {}) => req.get('/shops/getNearestWxShops', param)

// 店铺详情
export const getShopDetail = (param = {}) => req.get('/shops/wxshops', param)

// getRechargeRules
export const getRechargeRules = (param = {}) => req.get('/weapp/deposit/rechargerules', param)

// getRechargeAgreement
export const getRechargeAgreement = (param = {}) => req.get('/weapp/deposit/recharge/agreement', param)

// deposit recharge
export const depositRecharge = (param = {}) => req.post('/weapp/deposit/recharge', param)

// item list
export const getItemList = (param = {}) => req.get('/goods/items', param)

// item detail
export const getItemDetail = (param = {}) => req.get('/goods/items/', param)

// reservation add
export const addReservation = (param = {}) => req.post('/reservation', param)

// reservation getDateList
export const getDateList = (param = {}) => req.get('/reservation/dateDay', param)

// reservation getTimeList
export const getTimeList = (param ={}) => req.get('/reservation/timelist', param)

// getRecordList
export const getRecordList = (param = {}) => req.get('/reservation/recordlist', param)

// getCount
export const getCount = (param = {}) => req.get('/reservation/getCount', param)

// getCanReservationRights
export const getCanReservationRights = (param = {}) => req.get('/can/reservation/rights', param)

// rights list
export const getRightsList = (param = {}) => req.get('/rights', param)

// rights detail
export const getRightsDetail = (param = {}) => req.get('/rights', param)

// rights code
export const getRightsCode = (param = {}) => req.get('/rightscode', param)

// rights logs
export const getRightsLogs = (param = {}) => req.get('/rightsLogs', param)

// tracks viewnum
export const viewNum = (param = {}) => req.post('/track/viewnum', param)

// 创建订单
export const createOrder = (param = {}) => req.post('/order', param)

// 获取订单列表
export const getOrderList = (param = {}) => req.get('/orders', param)

// 获取订单数量
export const getOrderCount = (param = {}) => req.get('/orders/count', param)

export const getOrderCounts = (param = {}) => req.get('/orderscount', param)

// 获取订单详情
export const getOrderDetail = (param = {}) => req.get(`/order/${param.orderId}`)

// 计算订单
export const getCalculateTotal = (param = {}) => req.post('/getFreightFee', param)

// 获取自提码
export const getZitiCode = (param = {}) => req.get('/ziticode', param)

// 取消订单
export const cancelOrder = (param = {}) => req.post('/order/cancel', param)

// 确认收据
export const confirmReceipt = (param = {}) => req.post('/order/confirmReceipt', param)

// 售后申请
export const applyAfterSale = (param = {}) => req.post('/aftersales', param)

// 售后信息
export const getAfterSale = (param = {}) => req.get('/aftersales/info', param)

// 售后列表
export const getAfterList = (param = {}) => req.get('/aftersales', param)

// 关闭售后
export const closeAfterSale = (param = {}) => req.post('/aftersales/close', param)

// 发送反馈
export const sendBack = (param = {}) => req.post('/aftersales/sendback', param)

// 修改售后
export const modifyAfterSale = (param = {}) => req.post('/aftersales/modify', param)

// promotion
export const promotionFormId = (param = {}) => req.post('/promotion/formid', param)

// promotion register
export const promotionRegister = (param = {}) => req.post('/promotion/register', param)

// cash list
export const getCashList = (param = {}) => req.get('/cash_withdrawals', param)

// cash Application
export const cashApplication = (param = {}) => req.get('/cash_withdrawal', param)

// cash statics
export const getCashStatics = (param = {}) => req.get('/distributor/count', param)

// cash distributorIsValid
export const getCashDistributorIsValid = (param = {}) => req.get('/distributor/is_valid', param)

// 文章
export const viewArticle = (param = {}) => req.get('/article/management', param)

// 会员等级
export const vipBuy = (param = {}) => req.post('/vipgrades/buy', param)

// 会员购列表
export const getVipList = (param = {}) => req.get('/vipgrades/newlist', param)

// userVip
export const getUserVip = (param = {}) => req.get('/vipgrades/uservip', param)

// currency default
export const currencyDefault = (param = {}) => req.get('/currencyGetDefault', param)

// beDistributor
export const beDistributor = (param = {}) => req.post('/promoter', param)

// reDistributor
export const reDistributor = (param = {}) => req.put('/promoter', param)

// promoter index
export const promoterIndex = (param = {}) => req.get('/promoter/index', param)

// promoterInfo
export const promoterInfo = (param = {}) => req.get('/promoter/info', param)

// promoter children
export const promoterChildren = (param = {}) => req.get('/promoter/children', param)

// promoter brokerages
export const promoterBrokerages = (param = {}) => req.get('/promoter/brokerages', param)

// promoter statistics
export const promoterStatistics = (param = {}) => req.get('/promoter/brokerage/count', param)

// propmoter withdrawRecord
export const promoterWithdrawRecord = (param = {}) => req.get('/promoter/cash_withdrawal', param)

// promoter withdraw
export const promoterWithdraw = (param = {}) => req.post('/promoter/cash_withdrawal', param)

// promoter qrcode
export const promoterQrcode = (param = {}) => req.get('/promoter/qrcode', param)

// 图片上传
export const uploadImage = (param = {}) => req.get('/espier/image_upload_token', param)

// 活动详情
export const activityDetail = (param = {}) => req.get('/promotion/community/activityitemslist', param)

// 活动商品详情
export const activityGoodDetail = (param = {}) => req.get('/promotion/community/activityitemsinfo', param)

// 附近活动社区
export const activityCommunity = (param = {}) => req.get('/promotion/community/nearInfo', param)

// 活动社区列表
export const activityCommunityList = (param = {}) => req.get('/promotion/community/list', param)

// 活动社区详情
export const activityCommunityDetail = (param = {}) => req.get('/promotion/community/info', param)

// updateSalesCount
export const updateSalesCount = (param = {}) => req.get('/promotion/community/activityitemsales', param)

// getActivitySaleHistory
export const getActivitySaleHistory = (param = {}) => req.get('/promotion/community/activitySaleHistory', param)

// getActivityItemSaleHistory
export const getActivityItemSaleHistory = (param = {}) => req.get('/promotion/community/activityItemSaleHistory', param)