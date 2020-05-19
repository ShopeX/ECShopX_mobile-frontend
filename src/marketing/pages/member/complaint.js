import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAvatar, AtTextarea, AtButton, AtImagePicker } from 'taro-ui'
import { Loading } from '@/components'
import api from '@/api'
import req from '@/api/req'

import './complaint.scss'


function uploadURLFromRegionCode(code) {
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


export default class Complaint extends Component {
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
    let info = await api.member.getSalesperson();

    console.log('res', info)

    this.setState({ info })
  }

  /**
   * 起诉理由输入
   * */
  handleChangeReason(e) {
    this.setState({
      complaintReason: e.target.value
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
      Taro.showToast ({
        title:'最多上传3张图片',
        icon:'none'
      })

      return
    }

    const imgFiles = files.slice(0, 3)

    let promises = []

    for (let item of imgFiles) {
      const promise = new Promise(async (resolve, reject) => {
        if (!item.file) {
          resolve(item)
        } else {
          const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
          const { region, token, key, domain } = await req.get('/espier/image_upload_token', {
            filesystem: 'qiniu',
            filetype: 'complaint',
            filename
          })

          console.log(item, region, token, key, domain, 132)
          let uploadUrl = uploadURLFromRegionCode(region)

          console.log('uploadUrl --- val:',uploadUrl)

          // resolve()
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
    // log.debug('[qiniu uploaded] results: ', results)

    this.setState({
      files: results
    })
  }

  /**
   * 图片上传失败
   * */
  handleChangeUploadError(mes) {
    console.log('图片上传失败', mes)
  }

  /**
   * 投诉
   *  */
  async handleClickButton() {
    let { complaintReason: complaints_content, files } = this.state;

    if (!complaints_content) {
      Taro.showToast({
        title: '投诉内容不能为空',
        icon: 'none'
      })
      return
    }

    let nFiles = files.map(item => {
      return item.url
    })

    let params = {
      complaints_content,
      complaints_images: nFiles.join()
    }

    await api.member.setComplaints(params);

    await Taro.showToast({
      title: '投诉成功',
      icon: 'none'
    })

    Taro.redirectTo({
      url: '/pages/member/index'
    })
  }

  render() {
    const { info, complaintReason, files } = this.state

    if (!info) {
      return <Loading />
    }

    return (
      <View className='page-complaint'>
        <View className='pege-header'>
          <View>投诉对象：</View>
          <View className='flex exclusive-header'>
            <View className='exclusive-header__avatar'>
              <AtAvatar image={info.avatar}
                size='normal'
                circle
              />
            </View>
            <View className='exclusive-header__info'>
              <View className='exclusive-header__info-name'>
                {info.name}
              </View>
              <View className='exclusive-header__info-store_name'>
                {info.distributor.store_name}
              </View>
            </View>
          </View>
        </View>

        <View className='complaint-reason'>
          <View>投诉理由：</View>
          <AtTextarea
            className='complaint-reason__textarea'
            value={complaintReason}
            onChange={this.handleChangeReason.bind(this)}
            maxLength={200}
            height={300}
            placeholder='投诉内容'
          />
        </View>

        <View className='complaint-upload'>
          <View>上传图片：</View>
          <AtImagePicker
            multiple
            files={files}
            count={9}
            onFail={this.handleChangeUploadError.bind(this)}
            onChange={this.handleChangeUploadImg.bind(this)}
          />
        </View>

        <View className='complaint-button'>
          <AtButton
            type='primary'
            circle
            size='normal'
            onClick={this.handleClickButton.bind(this)}
          >
            投诉
            </AtButton>
        </View>
      </View>
    )
  }
}
