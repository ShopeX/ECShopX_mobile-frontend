import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtInput, AtTextarea, AtImagePicker, AtButton } from 'taro-ui'
import imgUploader from '@/utils/upload'
import S from '@/spx'
import api from '@/api'
// import req from '@/api/req'

import './shop-form.scss'

export default class DistributionShopForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {},
      imgs: []
    }
  }

  componentDidMount () {
    // const { imgs } = this.state
    const { key, val } = this.$router.params
    this.setState({
      info: {
        key,
        val
      }
    })
    if (key === 'shop_pic' && val) {
      this.setState({
        imgs: [{
          url: val
        }]
      })
    }
  }

  handleChange = (e) => {
    let value = e.detail ? e.detail.value : e
    const { key } = this.state.info
    this.setState({
      info: {
        key,
        val: value
      }
    })
  }

  handleSubmit = async() => {
    const { key, val } = this.state.info
    const params = {
      [key]: val
    }
    const { list = [] } = await api.distribution.update(params)
    if ( list[0] ) Taro.navigateBack()
  }

  handleImageChange = async (data, type) => {
    const { key } = this.state.info

    if (type === 'remove') {
      this.setState({
        imgs: data,
        info: {
          key,
          val: ''
        }
      })
      return
    }

    if (data.length > 1) {
      S.toast('最多上传1张图片')
    }
    const imgFiles = data.slice(0, 1)
    const res = await imgUploader.uploadImageFn(imgFiles)

    this.setState({
      imgs: res,
      info: {
        key,
        val: res[0].url
      }
    })
  }

  render () {
    const { info, imgs } = this.state

    return (
      <View className='page-distribution-shop-form'>
        <View className='shop-form'>
          {
            info.key == 'shop_name'
            && <AtInput
              type='text'
              title='小店名称'
              value={info.val}
              onChange={this.handleChange.bind(this)}
            />
          }
          {
            info.key == 'brief'
            && <AtTextarea
              type='textarea'
              title='小店描述'
              value={info.val}
              onChange={this.handleChange.bind(this)}
            />
          }
          {
            info.key == 'shop_pic'
              && <View className='pic-upload__img'>
                  <Text className='pic-upload__text'>上传店招</Text>
                  <View className='pic-upload__imgupload'>
                    <Text className='pic-upload__imgupload_text'>图片建议尺寸：320*100</Text>
                    <AtImagePicker
                      mode='aspectFill'
                      count={1}
                      length={3}
                      files={imgs}
                      onChange={this.handleImageChange.bind(this)}
                    > </AtImagePicker>
                  </View>
                </View>
          }
          <View className='shop_pic-btn'>
            <AtButton type='primary' onClick={this.handleSubmit.bind(this)}>提交</AtButton>
          </View>
        </View>
      </View>
    )
  }
}
