import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { SpPage, SpCell, SpImage, SpFloatLayout, SpCheckbox } from '@/components'
import { useLogin } from '@/hooks'
import api from '@/api'
import doc from '@/doc'
import S from '@/spx'
import { SG_POLICY } from '@/consts'
import { classNames, showToast, formatTime, isArray, goToPage, isWeixin, isWeb } from '@/utils'
import imgUploader from '@/utils/upload'
import { View, Input, Picker, Button } from '@tarojs/components'
import './user-info.scss'

const initialState = {
  formItems: [],
  formUserInfo: {},
  checkboxPickerTitle: '',
  showCheckboxPicker: false,
  checkboxKey: '',
  checkboxList: []
}

function MemberUserInfo(props) {
  const [state, setState] = useImmer(initialState)
  const {
    formItems,
    formUserInfo,
    checkboxPickerTitle,
    showCheckboxPicker,
    checkboxKey,
    checkboxList
  } = state
  const { userInfo = {}, vipInfo = {} } = useSelector((state) => state.user)
  const pageRef = useRef()
  const { getUserInfo, logout } = useLogin()

  useEffect(() => {
    getFormItem()
  }, [])

  useEffect(() => {
    if (showCheckboxPicker) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [showCheckboxPicker])

  // console.log('userInfo ******', userInfo)

  const getFormItem = async () => {
    const data = await api.user.regParam({
      is_edite_page: true
    })
    const _formItems = []
    const _formUserInfo = {
      avatar: userInfo.avatar,
      username: userInfo.username
    }
    Object.keys(data).forEach((key) => {
      if (data[key].is_open) {
        if (key !== 'mobile' && key !== 'username') {
          _formItems.push(data[key])
        }
      }
      if (data[key].element_type == 'checkbox') {
        _formUserInfo[key] = isArray(userInfo?.requestFields[key])
          ? userInfo?.requestFields[key]
          : []
      } else {
        _formUserInfo[key] = userInfo?.requestFields[key] || ''
      }
    })

    setState((draft) => {
      draft.formItems = _formItems
      draft.formUserInfo = _formUserInfo
    })
  }

  const renderText = ({ key, required_message, is_edit }) => {
    return (
      <Input
        name={key}
        class='input-field'
        value={formUserInfo[key]}
        placeholder={required_message}
        onInput={onChangePicker.bind(this, key)}
      />
    )
  }

  const renderNumber = ({ key, range: { start, end }, required_message, is_edit }) => {
    return (
      <Input
        name={key}
        type='number'
        value={formUserInfo[key]}
        max={end}
        min={start}
        placeholder={required_message}
        onInput={onChangePicker.bind(this, key)}
      />
    )
  }

  const onChangePicker = (key, e) => {
    setState((draft) => {
      draft.formUserInfo[key] = e.detail.value
    })
  }

  const onChangeSelectPicker = (key, e) => {
    const item = formItems.find((item) => item.key == key)
    const { select } = item
    setState((draft) => {
      draft.formUserInfo[key] = select[e.detail.value]
    })
  }

  const getIndexBySelecValue = (key) => {
    const item = formItems.find((item) => item.key == key)
    const { select } = item
    return select.findIndex((s) => s == formUserInfo[key])
  }

  const renderDatePicker = ({ key, required_message }) => {
    return (
      <Picker mode='date' value={formUserInfo[key]} onChange={onChangePicker.bind(this, key)}>
        <View
          className={classNames('picker-value', {
            'placeholder': !formUserInfo[key]
          })}
        >
          {formUserInfo[key] || required_message}
        </View>
      </Picker>
    )
  }

  const renderRadioPicker = ({ key, required_message, select }) => {
    return (
      <Picker
        mode='selector'
        value={getIndexBySelecValue(key)}
        onChange={onChangeSelectPicker.bind(this, key)}
        range={select}
      >
        <View
          className={classNames('picker-value', {
            'placeholder': !formUserInfo[key]
          })}
        >
          {formUserInfo[key] || required_message}
        </View>
      </Picker>
    )
  }

  const renderCheckboxPicker = ({ name, key, required_message, checkbox }) => {
    return (
      <View
        className={classNames('picker-value', {
          'placeholder': formUserInfo[key].length == 0
        })}
        onClick={() => {
          const _checkboxList = checkbox.map((item, index) => {
            const fd = formUserInfo[key].find((k) => k.name == item.name)
            const isChecked = fd ? fd.ischecked : false
            return {
              name: item.name,
              ischecked: isChecked
            }
          })

          setState((draft) => {
            draft.showCheckboxPicker = true
            draft.checkboxKey = key
            draft.checkboxPickerTitle = `选择${name}`
            draft.checkboxList = _checkboxList
          })
        }}
      >
        {formUserInfo[key].length > 0
          ? formUserInfo[key]
              .filter((item) => !!item.ischecked)
              .map((item) => item.name)
              .join(',')
          : required_message}
      </View>
    )
  }

  const compType = {
    1: renderText,
    2: renderNumber,
    3: renderDatePicker,
    4: renderRadioPicker,
    5: renderCheckboxPicker
  }

  const renderFormItem = (item) => {
    const { field_type } = item

    return compType[field_type] && compType[field_type](item)
  }

  const saveUserInfo = async () => {
    const { avatar, username } = formUserInfo
    await api.member.updateMemberInfo({
      username,
      avatar
    })
    await api.member.setMemberInfo({
      ...formUserInfo
    })
    showToast('修改成功')
    await getUserInfo(true)
    setTimeout(() => {
      Taro.navigateBack()
    }, 200)
  }

  const handleLogOff = async () => {
    const { status, msg } = await api.member.deleteMember({ is_delete: '0' })
    if (!status) {
      await Taro.showModal({
        content: msg,
        confirmText: '我知道了'
      })
    } else {
      Taro.navigateTo({
        url: `/marketing/pages/member/destroy-member?phone=${formUserInfo.mobile}`
      })
    }
  }

  // H5退出账号
  const handleLogOut = async () => {
    logout()
    showToast('退出登录成功')
    goToPage(process.env.APP_HOME_PAGE)
  }

  const onChooseAvatar = async (e) => {
    const res = await imgUploader.uploadImageFn([
      {
        file: {
          path: e.detail.avatarUrl
        },
        url: e.detail.avatarUrl
      }
    ])
    setState((draft) => {
      draft.formUserInfo.avatar = res[0].url
    })
  }

  const onUploadAvatarFile = async () => {
    const { tempFiles = [] } = await Taro.chooseImage({
      count: 1
    })
    if (tempFiles.length > 0) {
      const imgFiles = tempFiles.slice(0, 1).map((item) => {
        return {
          file: item,
          url: item.path
        }
      })
      const res = await imgUploader.uploadImageFn(imgFiles)
      setState((draft) => {
        draft.formUserInfo.avatar = res[0].url
      })
    }
  }

  const onChangeUsername = (e) => {
    setState((draft) => {
      draft.formUserInfo.username = e.detail.value
    })
  }

  const { agreeTime } = Taro.getStorageSync(SG_POLICY)
  let policyAgreeText = ''
  if (agreeTime) {
    policyAgreeText = `${formatTime(agreeTime, 'YYYY年MM月DD日')}同意`
  }

  // console.log('formUserInfo:', formUserInfo)

  const renderAvatar = () => {
    if (isWeixin) {
      return (
        <Button class='avatar-wrapper' open-type='chooseAvatar' onChooseAvatar={onChooseAvatar}>
          <SpImage src={formUserInfo.avatar || 'user_icon.png'} width={110} height={110} circle />
        </Button>
      )
    } else {
      return (
        <View class='avatar-wrapper' onClick={onUploadAvatarFile}>
          <SpImage src={formUserInfo.avatar || 'user_icon.png'} width={110} height={110} circle />
        </View>
      )
    }
  }
  return (
    <SpPage
      ref={pageRef}
      className='pages-member-user-info'
      renderFooter={
        <AtButton circle type='primary' onClick={saveUserInfo}>
          保存
        </AtButton>
      }
    >
      <View className='block-container'>
        <SpCell title='头像' isLink border value={renderAvatar()}></SpCell>
        <SpCell
          title='昵称'
          isLink
          border
          value={
            <Input
              name='nickname'
              value={formUserInfo.username}
              type='nickname'
              class='input-field'
              placeholder='请输入昵称'
              onInput={onChangeUsername}
              onConfirm={onChangeUsername}
            />
          }
        ></SpCell>
        <SpCell
          isLink
          title='手机号'
          value={userInfo?.mobile}
          onClick={() => {
            Taro.navigateTo({
              url: '/subpages/auth/edit-phone'
            })
          }}
        ></SpCell>
      </View>

      <View className='block-container'>
        {formItems.map((item, index) => (
          <SpCell
            title={item.name}
            isLink={item.element_type != 'input'}
            key={`userinfo-item__${index}`}
            border={index < formItems.length - 1}
            value={renderFormItem(item)}
          ></SpCell>
        ))}
      </View>

      <View className='block-container'>
        <SpCell
          isLink
          title='隐私政策和用户协议'
          value={policyAgreeText}
          onClick={() => {
            Taro.navigateTo({
              url: '/subpages/auth/reg-rule?type=privacyAndregister'
            })
          }}
        ></SpCell>
      </View>

      <View className='block-container'>
        <SpCell
          isLink
          title='注销账号'
          value='注销后无法恢复，请谨慎操作'
          onClick={handleLogOff}
        ></SpCell>
      </View>

      {isWeb && (
        <View className='block-container'>
          <SpCell isLink title='退出登录' value='退出当前账号' onClick={handleLogOut}></SpCell>
        </View>
      )}

      <SpFloatLayout
        title={checkboxPickerTitle}
        open={showCheckboxPicker}
        onClose={() => {
          setState((draft) => {
            draft.showCheckboxPicker = false
          })
        }}
        renderFooter={
          <AtButton
            circle
            type='primary'
            onClick={() => {
              // const fd = checkboxList.filter((item) => !!item.checked)
              setState((draft) => {
                draft.formUserInfo[checkboxKey] = checkboxList
                draft.showCheckboxPicker = false
              })
            }}
          >
            确定
          </AtButton>
        }
      >
        {checkboxList.map((item, index) => (
          <View className='checkout-item' key={`checkout-item__${index}`}>
            <SpCheckbox
              checked={item.ischecked}
              onChange={(e) => {
                setState((draft) => {
                  draft.checkboxList[index].ischecked = e
                })
              }}
            >
              {item.name}
            </SpCheckbox>
          </View>
        ))}
      </SpFloatLayout>
    </SpPage>
  )
}

MemberUserInfo.options = {
  addGlobalClass: true
}

export default MemberUserInfo
