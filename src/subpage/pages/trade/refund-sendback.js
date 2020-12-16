import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtInput, AtButton } from 'taro-ui'
import { NavBar, SpToast } from '@/components'
import api from '@/api'
import S from '@/spx'

import './refund-sendback.scss'

//const LOGISTICS_CODE = {"AAE":"AAE\u5168\u7403\u4e13\u9012","ANE":"\u5b89\u80fd\u7269\u6d41","ARAMEX":"Aramex","AT":"\u5965\u5730\u5229\u90ae\u653f","BALUNZHI":"\u5df4\u4f26\u652f\u5feb\u9012","BEL":"\u6bd4\u5229\u65f6\u90ae\u653f","BFDF":"\u767e\u798f\u4e1c\u65b9","BHT":"BHT\u5feb\u9012","BKWL":"\u5b9d\u51ef\u7269\u6d41","BQXHM":"\u5317\u9752\u5c0f\u7ea2\u5e3d","BR":"\u5df4\u897f\u90ae\u653f","BSWL":"\u90a6\u9001\u7269\u6d41","CA":"\u52a0\u62ff\u5927\u90ae\u653f","CITY100":"\u57ce\u5e02100","COE":"COE\u4e1c\u65b9\u5feb\u9012","CSCY":"\u957f\u6c99\u521b\u4e00","D4PX":"\u9012\u56db\u65b9\u901f\u9012","DBL":"\u5fb7\u90a6","DHL_C":"DHL(\u4e2d\u56fd\u4ef6)","DHL_DE":"DHL(\u5fb7\u56fd\u4ef6)","DHL_GLB":"DHL\u5168\u7403","DHL_USA":"DHL(\u7f8e\u56fd)","DK":"\u4e39\u9ea6\u90ae\u653f","DPEX":"DPEX","DSWL":"D\u901f\u7269\u6d41","DTWL":"\u5927\u7530\u7269\u6d41","EMS":"EMS\u56fd\u5185","EMSGJ":"EMS\u56fd\u9645","FAST":"\u5feb\u6377\u901f\u9012","FEDEX_C":"FedEx\u8054\u90a6\u5feb\u9012(\u4e2d\u56fd\u4ef6)","FKD":"\u98de\u5eb7\u8fbe","FKRFD":"\u51e1\u5ba2\u5982\u98ce\u8fbe","GHX":"\u6302\u53f7\u4fe1","GJYZ":"\u56fd\u9645\u90ae\u653f\u5305\u88f9","GSD":"\u5171\u901f\u8fbe","GTO":"\u56fd\u901a\u5feb\u9012","GTSD":"\u9ad8\u94c1\u901f\u9012","HHTT":"\u5929\u5929\u5feb\u9012","HOAU":"\u5929\u5730\u534e\u5b87","hq568":"\u534e\u5f3a\u7269\u6d41","HTKY":"\u767e\u4e16\u6c47\u901a","HXLWL":"\u534e\u590f\u9f99\u7269\u6d41","HYLSD":"\u597d\u6765\u8fd0\u5feb\u9012","IE":"\u7231\u5c14\u5170\u90ae\u653f","JD":"\u4eac\u4e1c\u5feb\u9012","JGSD":"\u4eac\u5e7f\u901f\u9012","JJKY":"\u4f73\u5409\u5feb\u8fd0","JLDT":"\u5609\u91cc\u5927\u901a","JP":"\u65e5\u672c\u90ae\u653f","JTKD":"\u6377\u7279\u5feb\u9012","JXD":"\u6025\u5148\u8fbe","JYKD":"\u664b\u8d8a\u5feb\u9012","JYM":"\u52a0\u8fd0\u7f8e","JYWL":"\u4f73\u6021\u7269\u6d41","LB":"\u9f99\u90a6\u5feb\u9012","LHTEX":"\u8054\u660a\u901a\u901f\u9012","NEDA":"\u80fd\u8fbe\u901f\u9012","NL":"\u8377\u5170\u90ae\u653f","ONTRAC":"ONTRAC","QFKD":"\u5168\u5cf0\u5feb\u9012","QRT":"\u5168\u65e5\u901a\u5feb\u9012","RDSE":"\u745e\u5178\u90ae\u653f","SDWL":"\u4e0a\u5927\u7269\u6d41","SF":"\u987a\u4e30\u5feb\u9012","SFWL":"\u76db\u4e30\u7269\u6d41","SHWL":"\u76db\u8f89\u7269\u6d41","ST":"\u901f\u901a\u7269\u6d41","STO":"\u7533\u901a\u5feb\u9012","STSD":"\u4e09\u6001\u901f\u9012","SURE":"\u901f\u5c14\u5feb\u9012","SWCH":"\u745e\u58eb\u90ae\u653f","TSSTO":"\u5510\u5c71\u7533\u901a","UAPEX":"\u5168\u4e00\u5feb\u9012","UC":"\u4f18\u901f\u5feb\u9012","UPS":"UPS","USPS":"USPS\u7f8e\u56fd\u90ae\u653f","XFEX":"\u4fe1\u4e30\u5feb\u9012","XYT":"\u5e0c\u4f18\u7279","YADEX":"\u6e90\u5b89\u8fbe\u5feb\u9012","YAMA":"\u65e5\u672c\u5927\u548c\u8fd0\u8f93(Yamato)","YD":"\u97f5\u8fbe\u5feb\u9012","YFEX":"\u8d8a\u4e30\u7269\u6d41","YFHEX":"\u539f\u98de\u822a\u7269\u6d41","YJSD":"\u94f6\u6377\u901f\u9012","YTO":"\u5706\u901a\u901f\u9012","YZPY":"\u90ae\u653f\u5e73\u90ae\/\u5c0f\u5305","ZENY":"\u589e\u76ca\u5feb\u9012","ZJS":"\u5b85\u6025\u9001","ZMKM":"\u829d\u9ebb\u5f00\u95e8","ZTE":"\u4f17\u901a\u5feb\u9012","ZTKY":"\u4e2d\u94c1\u5feb\u8fd0","ZTO":"\u4e2d\u901a\u901f\u9012","ZTWL":"\u4e2d\u94c1\u7269\u6d41","ZY_AG":"\u7231\u8d2d\u8f6c\u8fd0","ZY_AOZ":"\u7231\u6b27\u6d32","ZY_AUSE":"\u6fb3\u4e16\u901f\u9012","ZY_AXO":"AXO","ZY_AZY":"\u6fb3\u8f6c\u8fd0","ZY_BDA":"\u516b\u8fbe\u7f51","ZY_BEE":"\u871c\u8702\u901f\u9012","ZY_BH":"\u8d1d\u6d77\u901f\u9012","ZY_BL":"\u767e\u5229\u5feb\u9012","ZY_BM":"\u6591\u9a6c\u7269\u6d41","ZY_BOZ":"\u8d25\u6b27\u6d32","ZY_BT":"\u767e\u901a\u7269\u6d41","ZY_BYECO":"\u8d1d\u6613\u8d2d","ZY_CM":"\u7b56\u9a6c\u8f6c\u8fd0","ZY_CTM":"\u8d64\u5154\u9a6c\u8f6c\u8fd0","ZY_CUL":"CUL\u4e2d\u7f8e\u901f\u9012","ZY_DGHT":"\u5fb7\u56fd\u6d77\u6dd8\u4e4b\u5bb6","ZY_DYW":"\u5fb7\u8fd0\u7f51","ZY_EFS":"EFS POST","ZY_ETD":"ETD","ZY_FD":"\u98de\u789f\u5feb\u9012","ZY_FG":"\u98de\u9e3d\u5feb\u9012","ZY_FLSD":"\u98ce\u96f7\u901f\u9012","ZY_FX":"\u98ce\u884c\u5feb\u9012","ZY_FXSD":"\u98ce\u884c\u901f\u9012","ZY_FY":"\u98de\u6d0b\u5feb\u9012","ZY_HC":"\u7693\u6668\u5feb\u9012","ZY_HCYD":"\u7693\u6668\u4f18\u9012","ZY_HDB":"\u6d77\u5e26\u5b9d","ZY_HFMZ":"\u6c47\u4e30\u7f8e\u4e2d\u901f\u9012","ZY_HJSD":"\u8c6a\u6770\u901f\u9012","ZY_HMKD":"\u534e\u7f8e\u5feb\u9012","ZY_HTAO":"360hitao\u8f6c\u8fd0","ZY_HTCUN":"\u6d77\u6dd8\u6751","ZY_HTKE":"365\u6d77\u6dd8\u5ba2","ZY_HTONG":"\u534e\u901a\u5feb\u8fd0","ZY_HXKD":"\u6d77\u661f\u6865\u5feb\u9012","ZY_HXSY":"\u534e\u5174\u901f\u8fd0","ZY_HYSD":"\u6d77\u60a6\u901f\u9012","ZY_IHERB":"LogisticsY","ZY_JA":"\u541b\u5b89\u5feb\u9012","ZY_JD":"\u65f6\u4ee3\u8f6c\u8fd0","ZY_JDKD":"\u9a8f\u8fbe\u5feb\u9012","ZY_JDZY":"\u9a8f\u8fbe\u8f6c\u8fd0","ZY_JH":"\u4e45\u79be\u5feb\u9012","ZY_JHT":"\u91d1\u6d77\u6dd8","ZY_LBZY":"\u8054\u90a6\u8f6c\u8fd0FedRoad","ZY_LPZ":"\u9886\u8dd1\u8005\u5feb\u9012","ZY_LX":"\u9f99\u8c61\u5feb\u9012","ZY_LZWL":"\u91cf\u5b50\u7269\u6d41","ZY_MBZY":"\u660e\u90a6\u8f6c\u8fd0","ZY_MGZY":"\u7f8e\u56fd\u8f6c\u8fd0","ZY_MJ":"\u7f8e\u5609\u5feb\u9012","ZY_MST":"\u7f8e\u901f\u901a","ZY_MXZY":"\u7f8e\u897f\u8f6c\u8fd0","ZY_MZ":"168 \u7f8e\u4e2d\u5feb\u9012","ZY_OEJ":"\u6b27e\u6377","ZY_OZF":"\u6b27\u6d32\u75af","ZY_OZGO":"\u6b27\u6d32GO","ZY_QMT":"\u5168\u7f8e\u901a","ZY_QQEX":"QQ-EX","ZY_RDGJ":"\u6da6\u4e1c\u56fd\u9645\u5feb\u7ebf","ZY_RT":"\u745e\u5929\u5feb\u9012","ZY_RTSD":"\u745e\u5929\u901f\u9012","ZY_SCS":"SCS\u56fd\u9645\u7269\u6d41","ZY_SDKD":"\u901f\u8fbe\u5feb\u9012","ZY_SFZY":"\u56db\u65b9\u8f6c\u8fd0","ZY_SOHO":"SOHO\u82cf\u8c6a\u56fd\u9645","ZY_SONIC":"Sonic-Ex\u901f\u9012","ZY_ST":"\u4e0a\u817e\u5feb\u9012","ZY_TCM":"\u901a\u8bda\u7f8e\u4e2d\u5feb\u9012","ZY_TJ":"\u5929\u9645\u5feb\u9012","ZY_TM":"\u5929\u9a6c\u8f6c\u8fd0","ZY_TN":"\u6ed5\u725b\u5feb\u9012","ZY_TPAK":"TrakPak","ZY_TPY":"\u592a\u5e73\u6d0b\u5feb\u9012","ZY_TSZ":"\u5510\u4e09\u85cf\u8f6c\u8fd0","ZY_TTHT":"\u5929\u5929\u6d77\u6dd8","ZY_TWC":"TWC\u8f6c\u8fd0\u4e16\u754c","ZY_TX":"\u540c\u5fc3\u5feb\u9012","ZY_TY":"\u5929\u7ffc\u5feb\u9012","ZY_TZH":"\u540c\u821f\u5feb\u9012","ZY_UCS":"UCS\u5408\u4f17\u5feb\u9012","ZY_WDCS":"\u6587\u8fbe\u56fd\u9645DCS","ZY_XC":"\u661f\u8fb0\u5feb\u9012","ZY_XDKD":"\u8fc5\u8fbe\u5feb\u9012","ZY_XDSY":"\u4fe1\u8fbe\u901f\u8fd0","ZY_XF":"\u5148\u950b\u5feb\u9012","ZY_XGX":"\u65b0\u5e72\u7ebf\u5feb\u9012","ZY_XIYJ":"\u897f\u90ae\u5bc4","ZY_XJ":"\u4fe1\u6377\u8f6c\u8fd0","ZY_YGKD":"\u4f18\u8d2d\u5feb\u9012","ZY_YJSD":"\u53cb\u5bb6\u901f\u9012(UCS)","ZY_YPW":"\u4e91\u7554\u7f51","ZY_YQ":"\u4e91\u9a91\u5feb\u9012","ZY_YQWL":"\u4e00\u67d2\u7269\u6d41","ZY_YSSD":"\u4f18\u665f\u901f\u9012","ZY_YSW":"\u6613\u9001\u7f51","ZY_YTUSA":"\u8fd0\u6dd8\u7f8e\u56fd","ZY_ZCSD":"\u81f3\u8bda\u901f\u9012","ZYWL":"\u4e2d\u90ae\u7269\u6d41"}
const LOGISTICS_CODE={
  "SF": "顺丰速运",
  "HTKY": "百世快递",
  'ZTO':'中通快递',
  "STO": "申通快递",
  "YTO": "圆通速递",
  "YD": "韵达快递",
  "YZPY": "邮政快递包裹",
  "EMS": "EMS",
  "HHTT": "天天快递",
  "JD": "京东快递",
  "UC": "优速快递",
  "DBL": "德邦快递",
  "ZJS": "宅急送",
}
export default class TradeRefundSendback extends Component {
  constructor (props) {
    super(props)
    const express = []
    for (let key in LOGISTICS_CODE) {
      express.push({
        corp_code: key,
        corp_name: LOGISTICS_CODE[key]
      })
    }
    this.setState({
      express
    })


    this.state = {
      express,
      curExpressIdx: 0,
      corp_code: 'SF',
      logi_no: ''
    }
  }

 
  handleExpressChange = (e) => {
    const { value } = e.detail
    const { express } = this.state

    this.setState({
      curExpressIdx: value,
      corp_code: express[value].corp_code
    })
  }

  handleChange = (name, val) => {
    this.setState({
      [name]: val
    })
  }

  handleSubmit = async () => {
    const { logi_no, corp_code } = this.state
    const { item_id, order_id, aftersales_bn } = this.$router.params

    if (!corp_code) {
      S.toast('请填写物流公司')
      return
    }

    if (!logi_no) {
      S.toast('请填写物流单号')
      return
    }

    await api.aftersales.sendback({
      item_id,
      order_id,
      aftersales_bn,
      logi_no,
      corp_code
    })

    S.toast('操作成功')
    setTimeout(() => {
      Taro.redirectTo({
        url: '/subpage/pages/trade/after-sale'
      })
    }, 1000)
  }

  render () {
    const { express, logi_no, curExpressIdx } = this.state
    return (
      <View className='page-refund-sendback'>
        <NavBar
          title='售后填写物流公司'
          leftIconType='chevron-left'
          fixed='true'
        />

        <View className='sec'>
          <View className='at-input'>
            <View className='at-input__container'>
              <View className='at-input__title'>物流公司：</View>
              <Picker
                mode='selector'
                range={express}
                rangeKey='corp_name'
                onChange={this.handleExpressChange}
              >
                <View className='picker'>
                  {express[curExpressIdx].corp_name}
                </View>
              </Picker>
            </View>
          </View>

          <AtInput
            title='物流单号：'
            name='logi_no'
            type='text'
            placeholder='请填写物流单号'
            value={logi_no}
            onChange={this.handleChange.bind(this, 'logi_no')}
          />
        </View>

        <View className='btns'>
          <AtButton
            type='primary'
            onClick={this.handleSubmit}
          >保存</AtButton>
        </View>

        <SpToast />
      </View>
    )
  }
}
