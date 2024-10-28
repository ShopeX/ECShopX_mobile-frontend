import React, { Component } from 'react'
import { View, Text,Textarea } from '@tarojs/components'
import { classNames } from '@/utils'
import './index.scss'

export default class GoodsComment extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    isOpened: false,
    onClose: () => {}
  }

  constructor (props) {
    super(props)

    this.state = {
      isActive: props.isOpened,
      comment: '',
      input_bottom:0,
      count: 0
    }
  }
  componentDidMount () {}

  componentWillReceiveProps (nextProps) {
    const { isOpened } = nextProps
    if (isOpened !== this.state.isActive) {
      this.setState({
        isActive: isOpened
      })
    }
  }

  toggleShow = (isActive) => {
    if (isActive === undefined) {
      isActive = !this.state.isActive
    }

    this.setState({ isActive })
    this.props.onClose && this.props.onClose()
  }

   handleClickReply = async () => {
    const { comment } = this.state
    if (!comment || !comment.length) {
      return
    }
    this.props.onReplyRate && this.props.onReplyRate(comment)
    this.setState({
      comment: '',
      isActive: false,
      count:0
    })
  }

  setinputtop=(e)=>{
    console.log("键盘高度变化",e,e.detail.height)
    let het=e.detail.height-0
    this.setState({
      input_bottom:het
    })
  }

  handleChange (e) {
    let comment = e.detail.value
    this.setState({
      comment,
      count: comment ? comment.length : 0
    })
  }

  render () {
    const { isActive, comment, count,input_bottom } = this.state

    return (
      <View
        className={classNames(
          'goods-comment-panel',
          isActive ? 'goods-comment-panel__active' : null
        )}
      >
        <View
          className='goods-comment-panel__overlay'
          onClick={() => this.toggleShow(false)}
        ></View>

        <View className='goods-comment-panel__wrap'>
          <View className='goods-comment-panel__bd' style={{paddingBottom:`${input_bottom-0+10}px`}}>
            <Textarea
              className='comment'
              adjustPosition={false}
              value={comment}
              onInput={this.handleChange.bind(this)}
              placeholder='请输入您的评论'
              onKeyboardHeightChange={this.setinputtop.bind(this)}
            />
            <View className='reply-btns'>
              <Text className='count'>{count}/500</Text>
              <View
                className={classNames('btn', { 'btn-disabled': count == 0 })}
                onClick={this.handleClickReply}
              >
                发表
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
