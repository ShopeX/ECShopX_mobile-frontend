import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { classNames } from '@/utils'
import { AtTextarea } from 'taro-ui'
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

  async handleClickReply () {
    const { comment } = this.state
    if (!comment || !comment.length) {
      return
    }
    this.props.onReplyRate && this.props.onReplyRate(comment)
    this.setState({
      comment: '',
      isActive: false
    })
  }

  handleChange (e) {
    let comment = e
    this.setState({
      comment,
      count: comment ? comment.length : 0
    })
  }

  render () {
    const { isActive, comment, count } = this.state

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
          <View className='goods-comment-panel__bd'>
            <AtTextarea
              className='comment'
              count={false}
              value={comment}
              onChange={this.handleChange.bind(this)}
              maxLength={500}
              height={60}
              autoFocus
              fixed
              placeholder='请输入您的评论'
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
