import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtInput, AtTextarea, AtImagePicker, AtButton } from 'taro-ui'
import { SpCell } from '@/components'
import imgUploader from '@/utils/qiniu'
import S from '@/spx'
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
    const { imgs } = this.state
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

  uploadURLFromRegionCode = (code) => {
    let uploadURL = null;
    switch(code) {
        case 'z0': uploadURL = 'https://up.qiniup.com'; break;
        case 'z1': uploadURL = 'https://up-z1.qiniup.com'; break;
        case 'z2': uploadURL = 'https://up-z2.qiniup.com'; break;
        case 'na0': uploadURL = 'https://up-na0.qiniup.com'; break;
        case 'as0': uploadURL = 'https://up-as0.qiniup.com'; break;
        default: console.error('please make the region is with one of [z0, z1, z2, na0, as0]');
    }
    return uploadURL;
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
        imgs: data
      })
      return
    }

    if (data.length > 1) {
      S.toast('最多上传1张图片')
    }
    const imgFiles = data.slice(0, 1)
    let promises = []

    for (let item of imgFiles) {
      const promise = new Promise(async (resolve, reject) => {
        if (!item.file) {
          resolve(item)
        } else {
          const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
          const { region, token, key, domain } = await req.get('/espier/image_upload_token', {
            filesystem: 'qiniu',
            filetype: 'aftersales',
            filename
          })

          let uploadUrl = this.uploadURLFromRegionCode(region)
          Taro.uploadFile({
            url: uploadUrl,
            filePath: item.url,
            name: 'file',
            formData:{
              'token': token,
              'key': key
            },
            success: res => {
              let imgData = JSON.parse(res.data)
              resolve({
                url: `${domain}/${imgData.key}`
              })
            },
            fail: error => reject(error)
          })
        }
      })
      promises.push(promise)
    }

    const results = await Promise.all(promises)
    this.setState({
      imgs: results
    })
    this.setState({
      info: {
        key,
        val: results[0].url
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
                      count={1}
                      length={3}
                      files={imgs}
                      onChange={this.handleImageChange.bind(this)}
                    > </AtImagePicker>
                  </View>
                </View>
          }
          <View className="shop_pic-btn">
            <AtButton type="primary" onClick={this.handleSubmit.bind(this)}>提交</AtButton>
          </View>
        </View>
      </View>
    )
  }
}
