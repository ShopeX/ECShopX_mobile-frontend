import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { AtInput, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtButton } from 'taro-ui'
import { useSelector } from 'react-redux'
import { SpNumberKeyBoard, SpFloatLayout } from '@/components'
import { View, Text, Button } from '@tarojs/components'

import './comp-pointuse.scss'

const initialState = {
  isOpenRule: false
}

function CompPointUse(props) {
  const [state, setState] = useImmer(initialState)
  const { info, isOpened, onClose, onChange } = props
  const { pointName } = useSelector((state) => state.sys)
  const { isOpenRule } = state


  if (!info) {
    return null
  }

  const { deduct_point_rule = {} } = info

  return (
    <View className='comp-pointuse'>
      <SpFloatLayout className='point-float-layout' open={isOpened} hideClose>
        <View className='point-hd'>
          <View className='point-info'>{`可用${pointName}：${info.user_point}，本单可用${pointName}：${info.max_point}`}</View>
          <Text className="point-rule" onClick={() => {
            setState((draf) => {
              draf.isOpenRule = true
            })
          }}>使用规则</Text>
        </View>
        <SpNumberKeyBoard maxValue={info.max_point} value={info.user_point} onClose={onClose} onConfirm={onChange}/>
      </SpFloatLayout>

      <AtModal isOpened={isOpenRule}>
        <AtModalHeader>积分使用规则</AtModalHeader>
        <AtModalContent>
          <View>使用条件</View>
          <View>
            {`1. ${pointName}支付不得超出订单应付总金额的${deduct_point_rule.deduct_proportion_limit}%；`}
          </View>
          <View>使用数量</View>
          <View>{`2. ${deduct_point_rule.deduct_point}${pointName}抵1元；`}</View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => {
            setState((draf) => {
              draf.isOpenRule = false
            })
          }}>我知道了</Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
}

CompPointUse.defaultProps = {
  isOpened: false,
  disabledPoint: false,
  onClose: () => {}
}

CompPointUse.addGlobalClass = {
  addGlobalClass: true
}

export default CompPointUse
