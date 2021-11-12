import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import api from '@/api'

import './withdrawals-acount.scss'

export default class DistributionWithdrawalsAcount extends Component {
  constructor (props) {
    super(props)

    this.state = {
      acount: '',
      name: '',
      new_acount: '',
      hasBind: false,
      isEdit: false
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { alipay_name, alipay_account } = await api.distribution.info()
    this.setState({
      name: alipay_name,
      acount: alipay_account,
      hasBind: !!alipay_name && !!alipay_account
    })
  }

  handleChange = (name, val) => {
    this.setState({
      [name]: val
    })
  }

  handleClick = () => {
    this.setState({
      isEdit: true
    })
  }

  handleSubmit = async () => {
    const { name, acount, new_acount, hasBind, isEdit } = this.state
    const params = {
      alipay_name: name,
      //alipay_account: !hasBind ? acount : new_acount
      alipay_account: acount
    }
    const { list } = await api.distribution.update(params)
    const { alipay_name, alipay_account } = list[0]
    this.setState({
      name: alipay_name,
      acount: alipay_account,
      new_acount: '',
      isEdit: false
    })
    Taro.navigateBack()
  }

  render () {
    const { name, acount, isEdit, hasBind } = this.state
    console.log('00', hasBind)

    return (
      <View className='page-distribution-acount'>
        <View className='section list message'>
          <AtInput
            className='message-input'
            title='开户人姓名：'
            type='text'
            maxLength='30'
            onChange={this.handleChange.bind(this, 'name')}
            value={name}
            placeholder='请输入开户人姓名'
          />
          <AtInput
            className='message-input'
            title='支付宝账号'
            type='text'
            maxLength='30'
            onChange={this.handleChange.bind(this, 'acount')}
            value={acount}
            placeholder='请输入账号'
          />

          {/* {
            !hasBind
            ? <AtInput
                className='message-input'
                title='开户人姓名：'
                type='text'
                maxLength='30'
                onChange={this.handleChange.bind(this, 'name')}
                value={name}
                placeholder='请输入开户人姓名'
              />
            : <View className="list-item">
                <View className="">开户人姓名：</View>
                <View className="list-item-txt">{name}</View>
              </View>
          }
          {
            !hasBind
            ? <AtInput
                className='message-input'
                title='支付宝账号'
                type='text'
                maxLength='30'
                onChange={this.handleChange.bind(this, 'acount')}
                value={acount}
                placeholder='请输入账号'
              />
            : <View className="list-item">
                <View className="">
                  支付宝账号：
                </View>
                <View className="list-item-txt">{acount}</View>
              </View>
          }
          {
            hasBind && isEdit
            && <AtInput
                className='message-input'
                title='新支付宝账号'
                type='text'
                maxLength='30'
                onChange={this.handleChange.bind(this, 'new_acount')}
                value={new_acount}
                placeholder='请填写其他未绑定的支付宝账号'
              />
          } */}
        </View>
        <View className='content-padded'>
          <Button type='primary' onClick={this.handleSubmit}>
            确认绑定
          </Button>
          {/* { !hasBind && <Button type="primary" onClick={this.handleSubmit}>确认绑定</Button> }
          { hasBind && !isEdit && <Button type="primary" onClick={this.handleClick}>修改支付宝账号</Button> }
          { hasBind && isEdit && <Button type="primary" onClick={this.handleSubmit}>确认修改并保存</Button> } */}
        </View>
        <View className='g-ul'>
          <View className='g-ul-li'>请务必准确填写开户人姓名和支付宝账号</View>
          {/* <View className="g-ul-li">支持支付宝账户的修改，但每天仅限1次</View> */}
        </View>
      </View>
    )
  }
}
