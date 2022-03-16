import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import {
  AtFloatLayout,
  AtInput,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction
} from 'taro-ui'
import { useSelector } from 'react-redux'
import { SpCheckbox } from '@/components'
import { View, Text, Button } from '@tarojs/components'

import './comp-pointuse.scss'

const initialState = {
  isOpenRule: false,
  point: null,
  localType: null,
  chenckColors: 'none'
}

function CompPointUse(props) {
  const [state, setState] = useImmer(initialState)
  const { info, isOpened, loading, type, defalutPaytype, onChange, onClose } = props
  const { pointName } = useSelector((state) => state.sys)
  const { localType, point, isOpenRule, chenckColors } = state

  useEffect(() => {
    setState((draf) => {
      draf.localType = type
    })
  }, [type])

  const handleCancel = () => {
    setState((draf) => {
      draf.localType = type
      draf.isOpened = false
      draf.point = null
    })
    onClose()
  }
  const handleRuleOpen = (isOpenRule) => {
    setState((draf) => {
      draf.isOpenRule = isOpenRule
    })
  }

  const handlePointChange = (value) => {
    const max_point = Number(info.max_point)
    if (value >= max_point) {
      setState((draf) => {
        draf.localType = info.deduct_point_rule.full_amount ? 'point' : defalutPaytype
        draf.point = max_point
      })
      return max_point
    }
    setState((draf) => {
      draf.localType = info.deduct_point_rule.full_amount
        ? Number(value) === max_point
          ? 'point'
          : defalutPaytype
        : defalutPaytype
      draf.point = Number(value) > max_point ? max_point : value
    })
  }

  const handleUseFullAmount = (checked) => {
    setState((draf) => {
      draf.point = checked ? info.max_point : ''
      draf.disabledPoint = checked
      draf.localType = checked ? 'point' : localType
      draf.chenckColors = checked ? 'var(--color-primary)' : ''
    })
  }

  const handleChange = () => {
    handleCancel()
    onChange(point, localType)
  }

  if (!info) {
    return null
  }
  const { deduct_point_rule = {} } = info
  console.log(chenckColors, 'chenckColors')
  return (
    <View>
      <AtFloatLayout isOpened={isOpened} onClose={handleCancel}>
        <View className='comp-pointuse'>
          <View className='comp-pointuse__hd'>
            <Text>{pointName}</Text>
            <Text className='rule-title' onClick={() => handleRuleOpen(true)}>
              使用规则
            </Text>
            <View className='iconfont icon-close' onClick={handleCancel}></View>
          </View>
          <View className='comp-pointuse__bd'>
            <View className='point-item'>
              <View className='point-item__title'>{`用户可用${pointName}：`}</View>
              <View className='point-item__desc'>{info.user_point}</View>
            </View>
            <View className='point-item border'>
              <View className='point-item__title'>{`本单最大可用${pointName}：`}</View>
              <View className='point-item__desc'>{info.max_point}</View>
            </View>
            <View className='point-item'>
              <View className='point-item__title'>{`请输入抵扣${pointName}`}</View>
              <View className='point-item__desc'>
                <AtInput
                  type='number'
                  title=''
                  value={
                    point >= info.max_point ? info.max_point : point
                    // info.real_use_point
                    //   ? info.real_use_point < info.point_use
                    //     ? info.real_use_point
                    //     : info.point_use
                    //   : null
                  }
                  disabled={point >= info.max_point}
                  onChange={handlePointChange}
                />
              </View>
            </View>

            {deduct_point_rule && deduct_point_rule.full_amount && info.max_point > 0 && (
              <View className='point-item'>
                <View className='point-item__title'>
                  <SpCheckbox
                    colors={chenckColors}
                    checked={localType === 'point'}
                    onChange={handleUseFullAmount}
                  >
                    全额抵扣
                  </SpCheckbox>
                </View>
              </View>
            )}
          </View>
          <Button
            className='btn-submit'
            style='background: var(--color-primary); border-color: var(--color-primary)'
            loading={loading}
            onClick={handleChange}
          >
            确定
          </Button>
        </View>
      </AtFloatLayout>
      <AtModal isOpened={isOpenRule}>
        <AtModalHeader>积分使用规则</AtModalHeader>
        <AtModalContent>
          <View>使用条件</View>
          <View>
            {`1.${pointName}支付不得超出订单应付总金额的 ${deduct_point_rule.deduct_proportion_limit}%；`}
          </View>
          <View>使用数量</View>
          <View>{`2.${deduct_point_rule.deduct_point} ${pointName}抵 1 元；`}</View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => handleRuleOpen(false)}>我知道了</Button>
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
