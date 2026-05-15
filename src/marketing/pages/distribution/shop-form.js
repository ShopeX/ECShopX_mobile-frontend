/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTextarea, AtImagePicker, AtButton } from 'taro-ui'
import { withTranslation } from 'react-i18next'
import { SpPage, SpInput as AtInput } from '@/components'
import { $t } from '@/i18n'
import imgUploader from '@/utils/upload'
import S from '@/spx'
import api from '@/api'
import './shop-form.scss'

class DistributionShopForm extends Component {
  $instance = getCurrentInstance() || {}
  constructor(props) {
    super(props)

    this.state = {
      info: {},
      imgs: []
    }
  }

  componentDidMount() {
    const { key, val } = this.$instance?.router?.params
    this.setState({
      info: {
        key,
        val
      }
    })
    if (key === 'shop_pic' && val) {
      this.setState({
        imgs: [
          {
            url: val
          }
        ]
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

  handleSubmit = async () => {
    const { key, val } = this.state.info
    const params = {
      [key]: val
    }
    const { list = [] } = await api.distribution.update(params)
    if (list[0]) Taro.navigateBack()
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
      S?.toast($t('4bd877f8.1f6aa8'))
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

  render() {
    const { info, imgs } = this.state

    return (
      <SpPage className='page-distribution-shop-form'>
        <View className='shop-form min-h-full box-border'>
          {info.key == 'shop_name' && (
            <AtInput
              type='text'
              title={$t('4bd877f8.798f95')}
              value={info.val}
              onChange={this.handleChange.bind(this)}
            />
          )}
          {info.key == 'brief' && (
            <AtTextarea
              type='textarea'
              title={$t('4bd877f8.41479a')}
              value={info.val}
              onChange={this.handleChange.bind(this)}
            />
          )}
          {info.key == 'shop_pic' && (
            <View className='pic-upload__img'>
              <Text className='pic-upload__text'>{$t('4bd877f8.2856e8')}</Text>
              <View className='pic-upload__imgupload'>
                <Text className='pic-upload__imgupload_text'>{$t('4bd877f8.206a39')}</Text>
                <AtImagePicker
                  mode='aspectFill'
                  count={1}
                  length={3}
                  files={imgs}
                  onChange={this.handleImageChange.bind(this)}
                >
                  {' '}
                </AtImagePicker>
              </View>
            </View>
          )}
          <View className='shop_pic-btn'>
            <AtButton type='primary' onClick={this.handleSubmit.bind(this)}>
              {$t('4bd877f8.939d53')}
            </AtButton>
          </View>
        </View>
      </SpPage>
    )
  }
}

export default withTranslation()(DistributionShopForm)
