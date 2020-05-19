import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtAvatar } from "taro-ui";

import './exclusive-customer-service.scss';


export default class ExclusiveCustomerService extends Component {


  static defaultProps = {
    isOpened: false
  }

  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {

  }

  static options = {
    addGlobalClass: true
  }

  config = {
    // 定义需要引入的第三方组件
    usingComponents: {
      'cell': 'plugin://contactPlugin/cell'
    }
  }

  /**
   * 监听按钮点击事件执行开始时的回调
   * */
  startmessage() {
    console.log('监听按钮点击事件执行开始时的回调')
  }

  /**
   * 监听按钮点击事件执行完毕后的回调
   * */
  completemessage() {
    console.log('监听按钮点击事件执行完毕后的回调')
  }

  render() {
    let { info } = this.props;

    if (!info) return null;

    return (
      <View className='exclusive-customer-service exclusive'>
        <View className='exclusive-title'>
          我的导购/专属客服
        </View>

        <View className='exclusive-con'>
          <View className='exclusive-con__avatar'>
            <AtAvatar image={info.avatar}
              size='small'
              circle
            />
          </View>
          <View className='exclusive-con__info'>
            <View>
              <Text className='exclusive-con__info-name'>{info.name}</Text>
            </View>
            <View className='exclusive-con__info-store_addres'>
              <Text className='exclusive-con__info-store_name'>{info.distributor.store_name}</Text>
            </View>
            <View className='exclusive-con__info-store_address'>
              {info.distributor.store_address}
            </View>
          </View>
        </View>


        <View className='exclusive-button flex'>
          <View className='border-r contact-ta' onClick={() => Taro.showToast({title:'请查看服务通知',icon:'none'})}>
            <cell
              styleType='2'
              startmessage={this.startmessage.bind(this)}
              completemessage={this.completemessage.bind(this)}
              plugid={info.work_configid}
            />
          </View>
          <View className='d-button' onClick={() => { Taro.navigateTo({ url: '/marketing/pages/member/complaint' }) }}>
            <Image src='/assets/imgs/complaint_icon.png' />
          </View>

        </View>
      </View>
    )
  }
}
