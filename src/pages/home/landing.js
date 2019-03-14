
import Taro, { Component } from '@tarojs/taro'
import {View, Text } from '@tarojs/components'
import { connect } from "@tarojs/redux";
import { normalizeQuerys } from '@/utils'

// normalizeQuerys
import './landing.scss'
@connect(() => ({}), (dispatch) => ({
  onUserLanding: (land_params) => dispatch({ type: 'user/landing', payload: land_params })
}))
export default class Landing extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
    }
  }
  componentWillMount (options) {
    console.log(options, "landing20")
  }
  componentDidMount (options) {
    console.log(options, "landing24")
    // const query = normalizeQuerys(this.$router.params)
    // console.log(query, 24)
    // console.log(this.$router.params)

    // this.props.onUserLanding(query)

    // this.fetch()
  }

  async fetch () {
    Taro.redirectTo({
      // url: '/pages/home/index'
      url: '/pages/auth/reg'
    })
  }

  render () {
    const { land_params } = this.props
    // console.log(land_params)
    return (
      <View className='page-member-integral'>
        <View>跳转中...</View>

      </View>
    )
  }
}
