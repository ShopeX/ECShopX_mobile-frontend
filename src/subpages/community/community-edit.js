import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import { SpPage, SpCell, SpPickerAddress } from '@/components'
import './community-edit.scss'

function CommunityEdit(props) {
  const $instance = getCurrentInstance()
  const { type = 'add' } = $instance.router.params
  useEffect(() => {
    if (type == 'add') {
      Taro.setNavigationBarTitle({
        title: '添加自提点'
      })
    } else {
      Taro.setNavigationBarTitle({
        title: '编辑自提点'
      })
    }
  }, [])

  const handleConfirm = () => {}

  return (
    <SpPage
      className='page-community-edit'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleConfirm}>
            确定
          </AtButton>
        </View>
      }
    >
      <SpCell border title='所在区域'>
        <SpPickerAddress />
        {/* <Picker
          mode='multiSelector'
          onChange={this.bindMultiPickerChange}
          onColumnChange={this.bindMultiPickerColumnChange}
          value={multiIndex}
          range={areaList}
        >
          <View className='picker'>
            <View className='picker__title'>所在区域</View>
            {info.address_id ? (
              `${info.province}${info.city}${info.county}`
            ) : (
              <View>
                {multiIndex.length > 0 ? (
                  <Text>
                    {areaList[0][multiIndex[0]]}
                    {areaList[1][multiIndex[1]]}
                    {areaList[2][multiIndex[2]]}
                  </Text>
                ) : null}
              </View>
            )}
          </View>
        </Picker> */}
      </SpCell>
      <SpCell border title='自提地址'>
        <AtInput placeholder='请填写详细自提地址' />
      </SpCell>
    </SpPage>
  )
}

CommunityEdit.options = {
  addGlobalClass: true
}

export default CommunityEdit
