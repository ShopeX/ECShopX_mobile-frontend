import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtInput, AtTextarea, AtImagePicker } from 'taro-ui'
import { SpCell } from '@/components'
import imgUploader from '@/utils/qiniu'
import api from '@/api'
import req from '@/api/req'

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
    const { key, val } = this.$router.params
    this.setState({
      info: {
        key,
        val
      }
    })
  }

  handleChange = (e) => {
    let value = e.detail ? e.detail.value : e
    const { key, val } = this.state.info
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
    const { list } = await api.distribution.update(params)
    if ( list[0] ) Taro.navigateBack()
  }

  handleImageChange = async (data, type) => {
    const { key } = this.state.info

    if (type === 'remove') {
      this.setState({
        info: {
          imgs: data
        }
      })
      return
    }

    if (data.length > 3) {
      S.toast('最多上传3张图片')
    }
    const imgFiles = data.slice(0, 3)
    const res = await imgUploader.uploadImageFn(imgFiles, req.baseURL + 'espier/image_upload_token', 'qiniu', 'jpg/png', 'z2')
    this.setState({
      imgs: res
    })
    const params = {
      [key]: res[0].url
    }
    const { list } = await api.distribution.update(params)
    if ( list[0] ) Taro.navigateBack()
  }

  render () {
    const { info, imgs } = this.state

    return (
      <View className='page-distribution-shop-form'>
        <View className='shop-form'>
          <AtForm
            onSubmit={this.handleSubmit}
          >
            {
              info.key == 'shop_name'
              && <AtInput
                  type='text'
                  title="小店名称"
                  value={info.val}
                  onChange={this.handleChange.bind(this)}
                />
            }
            {
              info.key == 'brief'
              && <AtTextarea
                  type='textarea'
                  title="小店描述"
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
                        multiple
                        length={1}
                        files={imgs}
                        onChange={this.handleImageChange.bind(this)}
                      > </AtImagePicker>
                    </View>
                  </View>
            }
          </AtForm>
        </View>
      </View>
    )
  }
}
