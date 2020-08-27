import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Loading, Price, SpToast } from '@/components'
import api from '@/api'
import { withLogin } from '@/hocs'
import { pickBy, classNames } from '@/utils'
import { AtRate, AtTextarea, AtButton, AtImagePicker } from 'taro-ui'
import S from '@/spx'
import azureUploader from '@/utils/azure-wry'

import './rate.scss'

@withLogin()
export default class TradeRate extends Component {
  config = {
    navigationBarTitleText: '订单评价'
  }
  constructor (props) {
    super(props)

    this.state = {
      id: null,
      goodsList: [],
      anonymousStatus: 0
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const { id } = this.$router.params
    const data = await api.trade.detail(id)

    Taro.showLoading({
      mask: true
    })
    const info = pickBy(data.orderInfo, {
      orders: ({ items }) => pickBy(items, {
        item_id: 'item_id',
        item_spec_desc: 'item_spec_desc',
        pic_path: 'pic',
        title: 'item_name',
        price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
        num: 'num',
        star: 0,
        content: '',
        pics: []
      })
    })
    Taro.hideLoading()

    let goodsList = []
    let giftList = []
    if(info && info.orders.length > 0){
      info.orders.map(item => {
        if(item.order_item_type !== 'gift') {
          goodsList.push(item)
        } else {
          giftList.push(item)
        }
      })
    }

    this.setState({
      goodsList,
      id
    })
  }

  handleChange (index, value) {
    const { goodsList } = this.state
    goodsList[index].star = value
    this.setState({
      goodsList
    })
  }

  handleClickCheckbox = () => {
    let { anonymousStatus } = this.state
    this.setState({
      anonymousStatus: anonymousStatus ? 0 : 1
    })
  }

  handleChangeComment (index, e) {
    const { goodsList } = this.state
    goodsList[index].content = e
    this.setState({
      goodsList
    })
  }

  handleImageChange = (index, files, type) => {
    const { goodsList } = this.state
    if (type === 'remove') {
      goodsList[index].pics = files
      this.setState({
        goodsList
      })

      return
    }

    if (files.length > 6) {
      S.toast('最多上传6张图片')
      return
    }
    const imgFiles = files.slice(0, 6)
    azureUploader.uploadImagesFn(imgFiles)
      .then(res => {
        goodsList[index].pics = res
        this.setState({
          goodsList
        })
      })
  }

  handleClickSubmit = async () => {
    const { goodsList, id, anonymousStatus } = this.state
    let rates = []
    let errText = ''
    for (let item of goodsList) {
      if (!errText) {
        if (!item.star) {
          errText = '请打分'
          break
        }
        if (!item.content) {
          errText = '评价内容不能为空'
          break
        }
      }

      let pics = []
      item.pics.map(pic => {
        pics.push(pic.url)
      })
      rates.push({
        item_id: item.item_id,
        content: item.content,
        star: item.star,
        pics
      })
    }

    if (errText) {
      S.toast(errText)
      return
    }

    let params = {
      order_id: id,
      anonymous: anonymousStatus,
      rates
    }
    console.log('-----', params)
    Taro.showLoading({
      mask: true
    })
    await api.trade.createOrderRate(params)
    Taro.hideLoading()
    Taro.navigateTo({
      url: `/marketing/pages/item/success`
    })
  }

  // TODO: 确认原有功能
  render () {
    const { goodsList, anonymousStatus } = this.state
    if (!goodsList.length) {
      return (
        <Loading />
      )
    }

    return (
      <View className='trade-rate'>
        <View className='rate-list'>
          {goodsList.map((item, idx) => {
            return (
              <View className='rate-item' key={`${idx}1`}>
                <View className='goods-item'>
                  <View className='goods-item__hd'>
                    {Array.isArray(item.pic_path) && <Image
                      mode='aspectFill'
                      className='goods-item__img'
                      src={item.pic_path[0]}
                    />}
                    {!Array.isArray(item.pic_path) && <Image
                      mode='aspectFill'
                      className='goods-item__img'
                      src={item.pic_path}
                    />}
                  </View>
                  <View className='goods-item__bd'>
                    <Text className='goods-item__title'>{item.title}</Text>
                    {item.num && <Text className='goods-item__num'>数量：{item.num}</Text>}
                  </View>
                  <View className='goods-item__ft'>
                    <Price className='goods-item__price' value={item.price}></Price>
                    {item.item_spec_desc && <Text className='goods-item__spec'>{item.item_spec_desc}</Text>}
                  </View>
                </View>

                <View className='split-line'></View>

                <View className='rate-wrap'>
                  <AtRate size='22' value={item.star} onChange={this.handleChange.bind(this, idx)} />
                  <Text className='rate-num'>{item.star ? (item.star + '.0') : 0}分</Text>
                </View>

                <View className='comment-wrap'>
                  <AtTextarea
                    count={false}
                    value={item.content}
                    onChange={this.handleChangeComment.bind(this, idx)}
                    maxLength={500}
                    placeholderStyle='color: #a6a6a6;'
                    placeholder='快分享您的使用新得吧～（请输入评价内容）'
                  />
                  <View className='upload-imgs'>
                    <AtImagePicker
                      multiple
                      mode='aspectFill'
                      count={6}
                      length={4}
                      files={item.pics}
                      showAddBtn={item.pics.length !== 6}
                      onChange={this.handleImageChange.bind(this, idx)}
                    ></AtImagePicker>
                  </View>
                </View>
              </View>
            )
          })}
        </View>

        <View className='submit-btn'>
          <View className='anonymous-checkbox' onClick={this.handleClickCheckbox}>
            <View className={classNames('in-icon', anonymousStatus === 1 ? 'in-icon-checkbox' : 'in-icon-check-box')}></View>
            <Text>匿名提交</Text>
          </View>

          <AtButton full type='primary' onClick={this.handleClickSubmit}>发布</AtButton>
        </View>
        <SpToast />
      </View>
    )
  }
}
