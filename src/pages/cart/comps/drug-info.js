import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtFloatLayout, AtButton, AtInput, AtImagePicker } from 'taro-ui'
import { SpCheckbox } from '@/components'
import imgUploader from '@/utils/qiniu'
import req from '@/api/req'

import './drug-info.scss'

export default class DrugInfo extends Component {
  static defaultProps = {
    isOpened: false,
    onChange: () => {},
    onClose: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      info: {}
    }
  }

  handleChange = (name, val) => {
    const { info } = this.state
    info[name] = val
    this.setState({
      info
    })
  }

  handleImageChange = (data, type) => {
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
    imgUploader.uploadImageFn(imgFiles, req.baseURL + 'espier/image_upload_token', 'qiniu', 'jpg/png', 'z2')
      .then(res => {
        console.log(res)
        this.setState({
          info: {
            imgs: res
          }
        })
      })
  }

  render () {
    const { isOpened, onChange, onImgChange, onImageClick, onClose } = this.props
    const { info } = this.state

    return (
      <AtFloatLayout
        isOpened={isOpened}
        onClose={onClose}
      >
        <View class="drug-info">
          <AtInput
            title='用药人姓名'
            className='trade-remark__input'
            value={info.name}
            onChange={this.handleChange.bind(this, 'name')}
          />
          <AtInput
            title='用药人身份证'
            className='trade-remark__input'
            placeholder='请输入有效的身份证号'
            value={info.id_card}
            onChange={this.handleChange.bind(this, 'id_card')}
          />
          <View className='drug-describe'>
            <View className='drug-describe__img'>
              <Text className='drug-describe__text'>上传处方单</Text>
              <View className='drug-describe__imgupload'>
                <AtImagePicker
                  mode='aspectFill'
                  multiple
                  count={3}
                  length={3}
                  files={info.imgs}
                  onChange={this.handleImageChange.bind(this)}
                > </AtImagePicker>
              </View>
            </View>
          </View>
          <AtButton
            type='primary'
            onClick={this.props.onChange.bind(this, info)}
          >确定</AtButton>
        </View>
      </AtFloatLayout>
    )
  }
}
