/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAvatar, AtTextarea, AtButton, AtImagePicker } from 'taro-ui'
import { Loading, SpNavBar } from '@/components'
import { $t } from '@/i18n'
import api from '@/api'
import imgUploader from '@/utils/upload'
import './complaint.scss'

class Complaint extends Component {
  constructor(props) {
    super(props)

    this.state = {
      info: null,
      files: [],
      complaintReason: ''
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    let info = await api.member.getSalesperson()

    this.setState({ info })
  }

  /**
   * 起诉理由输入
   * */
  handleChangeReason(e) {
    this.setState({
      complaintReason: e
    })
  }

  /**
   * 图片上传
   * */
  async handleChangeUploadImg(files) {
    // this.setState({
    //   files
    // })

    if (files.length > 3) {
      Taro.showToast({
        title: $t('4fa8a55b.cfddcb'),
        icon: 'none'
      })

      return
    }

    const imgFiles = files.slice(0, 3)
    const results = await imgUploader.uploadImageFn(imgFiles)
    // log.debug('[qiniu uploaded] results: ', results)

    this.setState({
      files: results
    })
  }

  /**
   * 图片上传失败
   * */
  handleChangeUploadError(mes) {
    console.log('[complaint] image upload fail', mes)
  }

  /**
   * 投诉
   *  */
  async handleClickButton() {
    let { complaintReason: complaints_content, files } = this.state

    if (!complaints_content) {
      Taro.showToast({
        title: $t('7aa17a4c.696ddc'),
        icon: 'none'
      })
      return
    }

    let nFiles = files.map((item) => {
      return item.url
    })

    let params = {
      complaints_content,
      complaints_images: nFiles.join()
    }

    await api.member.setComplaints(params)

    await Taro.showToast({
      title: $t('7aa17a4c.8b0321'),
      icon: 'none'
    })

    Taro.redirectTo({
      url: '/subpages/member/index'
    })
  }

  render() {
    const { info, complaintReason, files } = this.state

    if (!info) {
      return <Loading />
    }

    return (
      <View className='page-complaint'>
        <SpNavBar title={$t('13af5909.e19d1d')} leftIconType='chevron-left' fixed='true' />
        <View className='pege-header'>
          <View>{$t('7aa17a4c.ebe0e9')}</View>
          <View className='flex exclusive-header'>
            <View className='exclusive-header__avatar'>
              <AtAvatar image={info.avatar} size='normal' circle />
            </View>
            <View className='exclusive-header__info'>
              <View className='exclusive-header__info-name'>{info.name}</View>
              <View className='exclusive-header__info-store_name'>
                {info.distributor.store_name}
              </View>
            </View>
          </View>
        </View>

        <View className='complaint-reason'>
          <View>{$t('7aa17a4c.82aa92')}</View>
          <AtTextarea
            className='complaint-reason__textarea'
            value={complaintReason}
            onChange={this.handleChangeReason.bind(this)}
            maxLength={200}
            height={300}
            placeholder={$t('7aa17a4c.4026ef')}
          />
        </View>

        <View className='complaint-upload'>
          <View>{$t('7aa17a4c.a8aeda')}</View>
          <AtImagePicker
            multiple
            files={files}
            count={9}
            onFail={this.handleChangeUploadError.bind(this)}
            onChange={this.handleChangeUploadImg.bind(this)}
          />
        </View>

        <View className='complaint-button'>
          <AtButton type='primary' circle size='normal' onClick={this.handleClickButton.bind(this)}>
            {$t('13af5909.e19d1d')}
          </AtButton>
        </View>
      </View>
    )
  }
}

export default withTranslation()(Complaint)
