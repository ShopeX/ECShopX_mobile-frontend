import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCountdown } from 'taro-ui'
import { Loading, SpToast, NavBar, FloatMenuMeiQia ,SpImg} from '@/components'
import { pickBy, formatTime, resolveOrderStatus, } from '@/utils'
import api from '@/api'





import './split-bagpack.scss'

@connect(({ colors }) => ({
    colors: colors.current
}))

// function resolveTradeOrders (info) {
//   return info.orders.map(order => {
//     const { item_id, title, pic_path: img, total_fee: price, num } = order
//     return {
//       item_id,
//       title,
//       img,
//       price,
//       num
//     }
//   })
// }

export default class TradeDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            info: null,
            timer: null,
            payLoading: false,
            sessionFrom: '',
            interval: null,
            webSocketIsOpen: false,
            restartOpenWebsoect: true
        }
    }

    componentDidShow () {
        this.fetch()
    }





    async fetch () {
        const { id } = this.$router.params
        const data = await api.trade.detail(id)
        let sessionFrom = ''
        console.log(data.orderInfo.item_fee)
        const info = pickBy(data.orderInfo, {
            tid: 'order_id',
            created_time_str: ({ create_time }) => formatTime(create_time * 1000),
            auto_cancel_seconds: 'auto_cancel_seconds',
            receiver_name: 'receiver_name',
            receiver_mobile: 'receiver_mobile',
            receiver_state: 'receiver_state',
            estimate_get_points: 'estimate_get_points',
            discount_fee: ({ discount_fee }) => (+discount_fee / 100).toFixed(2),
            point_fee: ({ point_fee }) => (+point_fee / 100).toFixed(2),
            point_use: 'point_use',
            receiver_city: 'receiver_city',
            receiver_district: 'receiver_district',
            receiver_address: 'receiver_address',
            status_desc: 'order_status_msg',
            delivery_code: 'delivery_code',
            delivery_name: 'delivery_corp_name',
            distributor_id: 'distributor_id',
            receipt_type: 'receipt_type',
            ziti_status: 'ziti_status',
            qrcode_url: 'qrcode_url',
            delivery_corp: 'delivery_corp',
            order_type: 'order_type',
            order_status_msg: 'order_status_msg',
            order_status_des: 'order_status_des',
            order_class: 'order_class',
            latest_aftersale_time: 'latest_aftersale_time',
            remark: 'remark',
            type: 'type',
            total_tax: ({ total_tax }) => (+total_tax / 100).toFixed(2),
            item_fee: ({ item_fee }) => (+item_fee / 100).toFixed(2),
            coupon_discount: ({ coupon_discount }) => (+coupon_discount / 100).toFixed(2),
            freight_fee: ({ freight_fee }) => (+freight_fee / 100).toFixed(2),
            payment: ({ pay_type, total_fee }) => pay_type === 'point' ? Math.floor(total_fee) : (+total_fee / 100).toFixed(2), // 积分向下取整
            pay_type: 'pay_type',
            pickupcode_status: 'pickupcode_status',
            invoice_content: 'invoice.content',
            point: 'point',
            status: ({ order_status }) => resolveOrderStatus(order_status),
            orders: ({ items = [] }) => pickBy(items, {
                order_id: 'order_id',
                item_id: 'item_id',
                // aftersales_status: ({ aftersales_status }) => AFTER_SALE_STATUS[aftersales_status],
                delivery_code: 'delivery_code',
                delivery_corp: 'delivery_corp',
                delivery_name: 'delivery_corp_name',
                delivery_status: 'delivery_status',
                delivery_time: 'delivery_time',
                aftersales_status: 'aftersales_status',
                pic_path: 'pic',
                title: 'item_name',
                type: 'type',
                origincountry_name: 'origincountry_name',
                origincountry_img_url: 'origincountry_img_url',
                delivery_status: 'delivery_status',
                price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
                point: 'item_point',
                num: 'num',
                item_spec_desc: 'item_spec_desc',
                order_item_type: 'order_item_type'
            })
        })

        const ziti = pickBy(data.distributor, {
            store_name: 'store_name',
            store_address: 'store_address',
            store_name: 'store_name',
            hour: 'hour',
            phone: 'phone',
        })




        const infoStatus = (info.status || '').toLowerCase()
        if (info.auto_cancel_seconds <= 0 && info.order_status_des === 'NOTPAY') {
            info.status = 'TRADE_CLOSED'
            info.order_status_msg = '已取消'
        }
        info.status_img = `ico_${infoStatus === 'trade_success' ? 'wait_rate' : infoStatus}.png`



        sessionFrom += '{'
        if (Taro.getStorageSync('userinfo')) {
            sessionFrom += `"nickName": "${Taro.getStorageSync('userinfo').username}", `
        }
        sessionFrom += `"商品": "${info.orders[0].title}"`
        sessionFrom += `"订单号": "${info.orders[0].order_id}"`
        sessionFrom += '}'

        this.setState({
            info,
            sessionFrom,
            ziti
        })
    }









    handleClickDelivery = () => {
        Taro.navigateTo({
            url: `/subpage/pages/trade/delivery-info?order_type=${this.state.info.order_type}&order_id=${this.state.info.tid}&delivery_code=${this.state.info.delivery_code}&delivery_corp=${this.state.info.delivery_corp}&delivery_name=${this.state.info.delivery_name}`
        })
    }









    render () {
        const { colors } = this.props
        const { info } = this.state
        if (!info) {
            return <Loading></Loading>
        }
        console.log(info, 'info');
        return (
            <View className="wuliu-detail">
                <NavBar title="订单详情" leftIconType="chevron-left" fixed="true" />

                <View className="wuliu-detail">
                    <View className="title-status">您有几个包裹已发出</View>
                    <View className="wuliu-detail-item">
                        <View className="wuliu-status">
                            <Text className='biao-icon biao-icon-yifahuo'><Text className="icon-text">已发货</Text></Text>
                            {/* <Text className='biao-icon biao-icon-daifahuo'>待发货</Text>  */}
                            <Text className='wuliu-order'>物流单号</Text>
                        </View>
                        <View className='wuliu-info'>
                            物流信息物流信息物流信息物流信息物流信息物流信息物流信息物流信息物流信息物流信息物流信息物流信息物流信息物流信息物流信息物流信息物流信息物流信息
                        </View>
                        <View className="good-list">
                            {/* <OrderItem
                               
                                info={info.orders[0]}
                            /> */}
                            <ScrollView
                                scrollX
                            >
                                <SpImg
                                    img-class='order-item__img'
                                    src={info.orders[0].pic_path}
                                    mode='aspectFill'
                                    width='300'
                                    lazyLoad
                                />
                                <SpImg
                                    img-class='order-item__img'
                                    src={info.orders[0].pic_path}
                                    mode='aspectFill'
                                    width='300'
                                    lazyLoad
                                />
                                <SpImg
                                    img-class='order-item__img'
                                    src={info.orders[0].pic_path}
                                    mode='aspectFill'
                                    width='300'
                                    lazyLoad
                                />
                                <SpImg
                                    img-class='order-item__img'
                                    src={info.orders[0].pic_path}
                                    mode='aspectFill'
                                    width='300'
                                    lazyLoad
                                />
                                <SpImg
                                    img-class='order-item__img'
                                    src={info.orders[0].pic_path}
                                    mode='aspectFill'
                                    width='300'
                                    lazyLoad
                                />
                                <SpImg
                                    img-class='order-item__img'
                                    src={info.orders[0].pic_path}
                                    mode='aspectFill'
                                    width='300'
                                    lazyLoad
                                />
                                <SpImg
                                    img-class='order-item__img'
                                    src={info.orders[0].pic_path}
                                    mode='aspectFill'
                                    width='300'
                                    lazyLoad
                                />
                                <SpImg
                                    img-class='order-item__img'
                                    src={info.orders[0].pic_path}
                                    mode='aspectFill'
                                    width='300'
                                    lazyLoad
                                />
                            
                            </ScrollView>
                            </View>
                        <View className="ft-tips">共几件商品</View>
                    </View>
                    {/* <DetailItem info={info} /> */}
                </View>
                <SpToast></SpToast>
            </View>
        );
    }
}
