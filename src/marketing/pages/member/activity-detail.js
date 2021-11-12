/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/marketing/pages/member/activity-detail.js
 * @Date: 2020-08-14 15:33:36
 * @LastEditors: Arvin
 * @LastEditTime: 2020-08-17 15:34:00
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import { withPager, withBackToTop } from '@/hocs'
import api from '@/api'
import { isArray } from '@/utils'

import './activity-detail.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class ActivityDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cur_activity_info: ''
    }
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    const { content } = await api.user.registrationRecordInfo({
      record_id: this.$router.params.record_id
    })

    let answer_data = []
    content.map((item) => {
      if (item.formdata && item.formdata.length > 0) {
        item.formdata.map((sec_item) => {
          if (isArray(sec_item.answer)) {
            if (sec_item.form_element === 'checkbox') {
              sec_item.answer = sec_item.answer.join(',')
            }
            if (sec_item.form_element === 'area') {
              sec_item.answer = sec_item.answer.join('')
            }
          }
          answer_data.push({
            field_title: sec_item.field_title,
            answer: sec_item.answer
          })
        })
      }
    })
    this.setState({
      cur_activity_info: answer_data
    })
  }

  handleback = () => {
    Taro.navigateBack()
  }

  render() {
    const { colors } = this.props
    const { cur_activity_info } = this.state

    return (
      <View className='activity-detail'>
        <View className='activity-detail__list'>
          {cur_activity_info &&
            cur_activity_info.map((item, index) => {
              return (
                <View key={`${index}1`} className='activity-detail__item'>
                  <Text className='activity-detail__item_title'>{item.field_title}</Text>
                  <Text className='activity-detail__item_value'>{item.answer}</Text>
                </View>
              )
            })}
        </View>
        <View
          className='activity-detail__btn'
          style={`background: ${colors.data[0].primary}`}
          onClick={this.handleback.bind(this)}
        >
          返回
        </View>
      </View>
    )
  }
}
