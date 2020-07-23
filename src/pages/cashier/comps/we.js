import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import api from '@/api'
import S from '@/spx'

import './we.scss'

export default class WeappBtn extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  handleClickPay = async () => {
    let { code } = this.$router.params;

    let { open_id } = await api.wx.getOpenid({code});

    const { info } = this.props
    const { order_id, order_type } = info
    const params = {
      pay_type: 'wxpay',
      order_id,
      order_type,
      open_id
    }

    let config = await api.cashier.getPayment(params)

    let { appId, timeStamp, nonceStr, signType, paySign } = config;

    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
         appId,     //公众号名称，由商户传入
         timeStamp,         //时间戳，自1970年以来的秒数
         nonceStr, //随机串
         package:config.package,
         signType,         //微信签名方式：
         paySign //微信签名
      },
      function(res){
        console.error(res)
        if(res.err_msg == "get_brand_wcpay_request:ok" ){
        // 使用以上方式判断前端返回,微信团队郑重提示：
              //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        }
       }
   );
  }


  render () {
    return (
      <View
        className='weapp-btn'
        onClick={this.handleClickPay.bind(this)}
      >
        微信支付
      </View>
    )
  }
}
