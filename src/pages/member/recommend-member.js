import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtRow, AtCol } from 'taro-ui'
import { Loading, SpNote } from '@/components'
import api from '@/api'
import { withPager } from '@/hocs'
import TradeItem from './comps/item'

import './recommend-member.scss'

@withPager
export default class RecommendMember extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: []
    }
  }


  render () {

    return (
      <View className='recommend-member'>

        <ScrollView
          scrollY
          className='recommend-member__scroll'
        >
          <View className='recommend-member__table'>
            <View className='at-row recommend-member__table-title'>
              <View className='at-col title-border'>等级</View>
              <View className='at-col title-border'>人数</View>
              <View className='at-col title-border'>积分分成</View>
              <View className='at-col'>现金分成</View>
            </View>
            <View className='recommend-member__table-content'>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
              <View className='at-row content-item'>
                <View className='at-col'>1</View>
                <View className='at-col'>77</View>
                <View className='at-col'>10%</View>
                <View className='at-col'>10%</View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
