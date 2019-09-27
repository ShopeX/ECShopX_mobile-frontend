import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'

import './activity-panel.scss';

export default class ActivityPanel extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null,
    onClose: () => {},
    onClick: () => {}
  }

  render () {
    const { info, isOpen, onClick, onClose } = this.props

    return (
      <View>
        <View
          className='goods-sec-specs'
          onClick={onClick}
          >
          <View className='goods-sec-label'>优惠</View>
          <View className='goods-sec-specs__activity'>
            {
              info.map(item =>{
                return (
                  <View
                    key={item.marketing_id}
                    className='goods-sec-specs__activity-item'
                  >
                    <Text className='goods-sec-specs__activity-label'>{item.promotion_tag}</Text>
                    <Text className='promotion-text'>{item.marketing_name}</Text>
                  </View>
                )
              })
            }
          </View>
          <View className='goods-sec-specs__activity-icon at-icon at-icon-chevron-right'></View>
        </View>

        <AtFloatLayout
          isOpened={isOpen}
          onClose={onClose}
          title="促销优惠"
          scrollX={false}
          scrollY={false}
          >
          <View className='goods-sec-specs'>
            <View className='goods-sec-specs__activity'>
              {
                info.map(item =>
                  <View
                    key={item.marketing_id}
                    className='goods-sec-specs__activity-item'
                  >
                    {
                      item.join_limit > 0
                        ? <View className='promotion-title'>以下优惠可参与{item.join_limit}次</View>
                        : null
                    }
                    <View>
                      <Text className='goods-sec-specs__activity-label'>{item.promotion_tag}</Text>
                      <Text className='promotion-text'>{item.marketing_name}</Text>
                    </View>
                    <View className='promotion-rule-content'>
                      <Text className='promotion-rule-content__text'>有效期至{item.end_date}</Text>
                      <Text className='promotion-rule-content__text'>活动规则：{item.condition_rules}</Text>
                    </View>
                    <View>
                      {
                        item.promotion_tag === '满赠' && item.gifts
                          ? <View>
                              {item.gifts.map(g_item => {
                                return (
                                  <View className='promotion-goods'>
                                    <Text className='promotion-goods__tag'>【赠品】</Text>
                                    <Text className='promotion-goods__name'>{g_item.gift.item_name} </Text>
                                    <Text className='promotion-goods__num'>x{g_item.gift.gift_num}</Text>
                                  </View>
                                )
                              })}
                            </View>
                          : null
                      }
                    </View>
                  </View>
                )
              }
            </View>
          </View>
        </AtFloatLayout>
      </View>
    )
  }
}
