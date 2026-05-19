/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtCurtain, AtButton } from 'taro-ui'
import { SpInput as AtInput } from '@/components'
import * as dianwuApi from '@/api/dianwu'
import doc from '@/subpages/doc'
import { selectMember } from '@/store/slices/dianwu'
import { pickBy, showToast, validate } from '@/utils'
import { $t } from '@/i18n'
import './comp-dianwu-select-member.scss'

/**
 * 店务-查询/选择会员弹层（扫码、手机号查询、创建会员），与收银台原逻辑一致。
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {() => void} [onAfterSelect] 选中或创建会员并 dispatch 成功后调用（如结算页需刷新 checkout）
 * @param {string|number} [distributor_id] 分销商/门店，创建会员接口必传
 */
function CompDianwuSelectMember({ open, onClose, onAfterSelect, distributor_id }) {
  const dispatch = useDispatch()
  const member = useSelector((s) => s.dianwu.member)
  const prevMemberRef = useRef(member)
  const [mobile, setMobile] = useState('')
  const [searchMemberResult, setSearchMemberResult] = useState(null)

  useEffect(() => {
    if (prevMemberRef.current && !member) {
      setMobile('')
      setSearchMemberResult(null)
    }
    prevMemberRef.current = member
  }, [member])

  const handleScanCode = async () => {
    const { errMsg, result } = await Taro.scanCode()
    if (errMsg == 'scanCode:ok') {
      Taro.showLoading({ title: '' })
      const { list } = await dianwuApi.getMembers({
        user_card_code: result.split('_')[1]
      })
      Taro.hideLoading()
      setSearchMemberResult(pickBy(list, doc.dianwu.MEMBER_ITEM))
    } else {
      showToast(errMsg)
    }
  }

  const handleSelectMember = async () => {
    const [item] = searchMemberResult
    const userInfo = await dianwuApi.getMemberByUserId({ user_id: item.userId })
    const { couponNum, point, vipDiscount } = pickBy(userInfo, doc.dianwu.MEMBER_INFO)
    dispatch(
      selectMember({
        ...item,
        couponNum,
        point,
        vipDiscount
      })
    )
    setMobile('')
    setSearchMemberResult(null)
    onClose()
    onAfterSelect?.()
  }

  const handleCreateMember = async () => {
    const res = await dianwuApi.createMember({ mobile, distributor_id })
    const newUser = pickBy(res, doc.dianwu.CREATE_MEMBER_ITEM)
    const userInfo = await dianwuApi.getMemberByUserId({ user_id: newUser.userId })
    const { couponNum, point, vipDiscount } = pickBy(userInfo, doc.dianwu.MEMBER_INFO)
    dispatch(
      selectMember({
        ...newUser,
        couponNum,
        point,
        vipDiscount
      })
    )
    setMobile('')
    setSearchMemberResult(null)
    onClose()
    onAfterSelect?.()
  }

  const onChangeMobile = (e) => {
    setMobile(e)
  }

  const handleConfirm = async () => {
    if (validate.isMobileNum(mobile)) {
      const { list } = await dianwuApi.getMembers({
        mobile
      })
      setSearchMemberResult(pickBy(list, doc.dianwu.MEMBER_ITEM))
    } else {
      showToast($t('09e29d60.a32ab5'))
    }
  }

  return (
    <AtCurtain isOpened={open} onClose={onClose}>
      <View className='comp-dianwu-select-member'>
        <View className='search-user'>
          <View className='search-user-hd'>
            <View className='title'>{$t('09e29d60.49cc45')}</View>
            <View className='scan-member' onClick={handleScanCode}>
              <Text className='iconfont icon-saoma'></Text>
              {$t('09e29d60.9d27f8')}
            </View>
          </View>
          <View className='search-user-bd'>
            <View className='form-field'>
              <AtInput
                name='mobile'
                value={mobile}
                className='mobile'
                placeholder={$t('09e29d60.6e4f4b')}
                onChange={onChangeMobile}
                onConfirm={handleConfirm}
              />
            </View>
            {searchMemberResult && (
              <View className='search-result'>
                {searchMemberResult?.length == 0 && <Text>{$t('09e29d60.6136c3')}</Text>}
                {searchMemberResult?.length > 0 && (
                  <Text>{`${searchMemberResult[0]?.username} ${searchMemberResult[0]?.mobile}`}</Text>
                )}
              </View>
            )}
          </View>
          <View className='search-user-ft'>
            <View className='btn-cancel' onClick={onClose}>
              {$t('09e29d60.625fb2')}
            </View>
            {searchMemberResult?.length > 0 && (
              <AtButton className='btn-confirm' onClick={handleSelectMember}>
                {$t('09e29d60.3a6fa4')}
              </AtButton>
            )}
            {searchMemberResult?.length == 0 && (
              <AtButton className='btn-confirm' onClick={handleCreateMember}>
                {$t('09e29d60.9fd000')}
              </AtButton>
            )}
          </View>
        </View>
      </View>
    </AtCurtain>
  )
}

/** 结算页等场景：浅蓝底、蓝边框、圆角条样式 */
export function CompDianwuSelectMemberCheckoutTrigger({ onOpen }) {
  return (
    <View className='comp-dianwu-select-member-trigger-checkout' onClick={onOpen}>
      {$t('09e29d60.3a6fa4')}
    </View>
  )
}

CompDianwuSelectMember.options = {
  addGlobalClass: true
}

export default CompDianwuSelectMember
