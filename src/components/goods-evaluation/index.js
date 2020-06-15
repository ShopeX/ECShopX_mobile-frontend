import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { classNames, formatDataTime, styleNames } from '@/utils'
import { AtRate } from 'taro-ui'

import './index.scss'

export default class GoodsEvaluation extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null,
    showComment: false
  }

  constructor (props) {
    super(props)

    this.state = {
        styles: {height: '220rpx'}
    }
  }

  componentDidMount () {
    const { windowWidth } = Taro.getSystemInfoSync()

    let height = ((windowWidth*2) - 169) / 3 + 'rpx'
    this.setState({
        styles: {
            height
        }
    })
  }

  handleSelectEvaluation () {
    this.props.onChange && this.props.onChange(this.props.info)
  }

  /*handleClickLike () {
    this.props.onPraiseRate && this.props.onPraiseRate(this.props.info)
  }*/

  handleClickEvaluate () {
    this.props.onReplyRate() && this.props.onReplyRate(this.props.info)
  }

  /*previewImg (url, e) {
    e.stopPropagation()
    this.props.onPreviewImg() && this.props.onPreviewImg(url)
  }*/


  render () {
    const { info, showComment, pathRoute } = this.props
    const { styles } = this.state
    if (!info) {
      return null
    }

    if(pathRoute === 'detail'){
      if(info && info.picList) {
        if(info.picList.length > 3) {
          info.picList = info.picList.slice(0, 3)
        }
      }
    }

    return (
      <View className='evaluation-item' onClick={this.handleSelectEvaluation}>
        <View className='evaluation-item__avator'>
          <Image src={info.avatar} mode='aspectFill' className='avatar' />
        </View>
        <View className='evaluation-item__main'>
          <View className='name-wrap'>
            <Text className='name'>{info.username}</Text>
            <AtRate size='12' value={info.star} />
          </View>
          <View className='desc'>{info.content}</View>
          {info.rate_pic_num>0 && <View className='evaluation_imgs'>
            {info.picList.map((imgUrl, index) => {
              return (
                <View
                  key={index}
                  style={styleNames(styles)}
                  className={`img-box ${pathRoute === 'detail' ? '' : 'marginBottom10'}`}
                >
                  <Image className='img-rate' style={styleNames(styles)} src={imgUrl} mode='aspectFill' />
                </View>
              )
            })}
          </View>}

          {
            showComment && ( <View className='reply-comment' onClick={this.handleClickEvaluate.bind(this, info)}>
              <Text className='text'>评论</Text>
              <Text className='text'>{info.reply.total_count}</Text>
            </View>)
          }

          {showComment && info.reply && info.reply.list && info.reply.list.length > 0 && <View className='reply-wrap'>
            {
              info.reply.list.map(reply => {
                return (
                  <View className='reply-item' key={reply.reply_id}>
                    <Text className='reply-name'>{reply.username}：</Text>
                    <Text className='reply-content'>{reply.content}</Text>
                  </View>
                )
              })
            }
          </View>}

        </View>

       {/* <View className={classNames('option-wrap', {'no-pic': !info.rate_pic_num})}>
          <Text className='pro-spec'>{info.item_spec_desc}</Text>
          <View className='btns-wrap'>
            <View className='btn-common' onClick={this.handleClickLike.bind(this)}>
              <View className={classNames('in-icon in-icon-dianzan', {'active': info.praise_status})}></View>
              <Text className='text'>{info.praise_num}</Text>
            </View>
            <View className='btn-common' onClick={this.handleClickEvaluate.bind(this)}>
              <View className='in-icon in-icon-pinglun'>评论</View>
              <Text className='text'>{info.reply.total_count}</Text>
            </View>
          </View>
        </View> */}

            {/* {showComment && info.reply && info.reply.total_count > 0 && <View className='reply-wrap'>
                {
                    info.reply.list.map(reply => {
                        return (
                            <View className='reply-item' key={reply.reply_id}>
                                <Text className='reply-name'>{reply.username}：</Text>
                                <Text className='reply-content'>{reply.content}</Text>
                            </View>
                        )
                    })
                }
            </View>} */}
        </View>
    )
  }
}
