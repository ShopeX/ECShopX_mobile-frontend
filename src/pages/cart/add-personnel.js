import React, { useEffect } from 'react'
import { View, Text, Picker } from '@tarojs/components'
import { SpCell, SpPage, SpCheckbox, SpInput as AtInput } from '@/components'
import { useImmer } from 'use-immer'
import { relationship } from '@/consts'
import { AtButton } from 'taro-ui'
import { showToast, validate } from '@/utils'
import Taro, { useRouter } from '@tarojs/taro'
import api from '@/api'

import './add-personnel.scss'


const initialState = {
  info: {
    user_family_name: '',
    user_family_id_card: '',
    user_family_phone: '',
    user_family_age: '',
    user_family_gender: '',
    relationship: ''
  },
  selector: relationship,
  handlechecked: null
}


function AddPersonnel() {
  const [state, setState] = useImmer(initialState)

  const {
    info,
    selector,
    handlechecked
  } = state
  const router = useRouter()

  useEffect(() => {
    medicationPersonnel()
  }, [])

  const medicationPersonnel = async () => {
    const { id } = router.params
    if (id) {
      let res = await api.prescriptionDrug.medicationPersonnelDetail({ id })
      res.relationship = res.relationship - 1
      setState((draft) => {
        draft.info = res
        draft.handlechecked = res.user_family_gender
      })
    }
  }
  const handleClickToEdit = async () => {
    if (info.user_family_name == '') {
      showToast('请输入用药人姓名')
      return
    }
    if (info.user_family_id_card == '') {
      showToast('请输入用药人身份证号码')
      return
    }
    if (!/^\d{17}[\dXx]$/.test(info.user_family_id_card)) {
      showToast('请输入正确的身份证号码');
    }
    if (info.user_family_phone == '') {
      showToast('请输入联系人手机号')
      return
    }
    if (!validate.isMobileNum(info.user_family_phone)) {
      showToast('请输入正确的手机号')
      return
    }
    if (info.user_family_gender == '') {
      showToast('请输入就诊人性别')
      return
    }
    if (info.relationship == '') {
      showToast('请输入就诊人与认诊人关系')
      return
    }
    let params = {
      ...info,
      relationship: Number(info.relationship) + 1
    }
    if (router.params.id) {
      await api.prescriptionDrug.putMedicationPersonnel(params)
    } else {
      await api.prescriptionDrug.medicationPersonnel(params)
    }
    showToast(`${router.params.id ? '编辑' : '添加'}成功`)
    setTimeout(() => {
      Taro.navigateBack()
    }, 300)
  }

  const onPickerClick = (e) => {

  }

  const handleChange = (name, val) => {
    const nInfo = JSON.parse(JSON.stringify(state.info || {}))
    if (name == 'user_family_id_card' && val.length == 18) {
      nInfo.user_family_age = calculateAgeByIdCard(val)
    }
    nInfo[name] = val
    setState((draft) => {
      draft.info = nInfo
      draft.handlechecked = name === 'user_family_gender' ? val : handlechecked
    })
  }

  const pickerChange = (e) => {
    const nInfo = JSON.parse(JSON.stringify(state.info || {}))
    nInfo.relationship = e.detail.value
    setState((draft) => {
      draft.info = nInfo
    })
  }


  const calculateAgeByIdCard = (idCard) => {
    // 检查身份证号码长度是否为18位
    if (!/^\d{17}[\dXx]$/.test(idCard)) {
      throw new Error('无效的身份证号码');
    }

    // 提取出生日期部分
    const birthDateStr = idCard.substring(6, 14);
    const year = parseInt(birthDateStr.substring(0, 4), 10);
    const month = parseInt(birthDateStr.substring(4, 6), 10);
    const day = parseInt(birthDateStr.substring(6, 8), 10);

    // 创建出生日期对象
    const birthDate = new Date(year, month - 1, day); // 月份在Date对象中是从0开始的，所以要减1

    // 获取当前日期
    const today = new Date();

    // 计算年龄
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // 如果还没到生日，年龄要减1
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  }


  return (
    <SpPage className='add-personnel'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleClickToEdit}>
            保存
          </AtButton>
        </View>
      }
    >
      <View className='prompt'>
        <Text className='iconfont icon-bg-security'></Text>
        基于国家互联网诊疗规定，请如实填写下列信息，改信息仅用于为您直接提供
        服务的药师，药师在线续方，所有信息严格保密
      </View>

      <View className='scroll-view-container'>
        <View className='scroll-view-body'>
          <View className='page-address-edit__form'>
            <SpCell className='logistics-no border-bottom' title='用药人姓名'>
              <AtInput
                name='user_family_name'
                value={info?.user_family_name}
                cursor={info?.user_family_name?.length}
                placeholder='请输入用药人姓名'
                onChange={(e) => handleChange('user_family_name', e)}
              />
            </SpCell>

            <SpCell className='logistics-no border-bottom' title='用药人身份证号'>
              <AtInput
                name='user_family_id_card'
                value={info?.user_family_id_card}
                cursor={info?.user_family_id_card?.length}
                placeholder='请输入用药人证件号'
                onChange={(e) => handleChange('user_family_id_card', e)}
              />
            </SpCell>

            <SpCell className='logistics-no border-bottom' title='手机号码'>
              <AtInput
                name='user_family_phone'
                maxLength={11}
                value={info?.user_family_phone}
                cursor={info?.user_family_phone?.length}
                placeholder='请输入联系人手机号'
                onChange={(e) => handleChange('user_family_phone', e)}
              />
            </SpCell>

            <SpCell className='logistics-no border-bottom' title='就诊人年纪'>
              {/* <AtInput
                name='user_family_age'
                maxLength={11}
                value={info?.user_family_age}
                cursor={info?.user_family_age?.length}
                placeholder='根据证件号自动识别'
                onChange={(e) => handleChange('user_family_age', e)}
              /> */}
              <View className='ages'>{info?.user_family_age ? info?.user_family_age : '根据证件号自动识别'}</View>
            </SpCell>

            <SpCell className='logistics-no border-bottom' title='就诊人性别'>
              <View className='gender'>
                <SpCheckbox
                  checked={handlechecked == 1}
                  label='男'
                  onChange={handleChange.bind(this, 'user_family_gender', 1)}
                />

                <SpCheckbox
                  checked={handlechecked == 2}
                  label='女'
                  className='genders'
                  onChange={handleChange.bind(this, 'user_family_gender', 2)}
                />
              </View>
            </SpCell>

            <Picker mode='selector' range={selector} rangeKey='value' onChange={pickerChange}>
              <SpCell
                className='logistics-no province border-bottom'
                title='就诊人与认诊人关系'
                isLink
                arrow
                onClick={onPickerClick}
              >
                <View className='picker'>
                  {
                    selector?.[info.relationship]?.value ? selector[info.relationship].value : '请选择就诊人与认诊人关系'
                  }
                </View>
              </SpCell>
            </Picker>
          </View>

        </View>
      </View>


    </SpPage>
  )
}

export default AddPersonnel
