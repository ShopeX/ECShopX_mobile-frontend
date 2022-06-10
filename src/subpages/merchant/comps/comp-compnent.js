import Taro from '@tarojs/taro'
import { useEffect, useState, useCallback, useRef } from 'react'
import { Text, View, Input, Picker } from '@tarojs/components'
import { Loading, SpPickerAddress } from '@/components'
import { useDepChange } from '@/hooks'
import S from '@/spx'
import { isWeb } from '@/utils/platforms'
import { classNames } from '@/utils'
import './comp-compnent.scss'

const Button = (props) => {
  const { className, children, onClick = () => {}, loading } = props
  return (
    <View className={classNames('comps-button', className, { loading })} onClick={onClick}>
      {loading ? <Loading>{children}</Loading> : children}
    </View>
  )
}

const Radio = (props) => {
  const { checked, onClick = () => {} } = props
  return (
    <View className={classNames('comps-radio', { 'is-checked': checked })} onClick={onClick}>
      {checked && <Text className='iconfont icon-gou'></Text>}
    </View>
  )
}

const RadioGroup = (props) => {
  const { options = [], value, onClick = () => {} } = props

  return (
    <View className={classNames('comps-radio-group')}>
      {options.map((item, index) => (
        <View className='comps-radio-group-item' onClick={() => onClick(item)} key={index}>
          <Radio checked={value == item.value} />
          <Text className='comps-radio-group-item_text'>{item.label}</Text>
        </View>
      ))}
    </View>
  )
}

const Cell = (props) => {
  const {
    className,
    onlyShow = false,
    title = '',
    required,
    mode = 'selector',
    radioOptions = [],
    onRadioChange = () => {},
    placeholder,
    areaList = [],
    onColumnChange,
    onChange,
    selectArea = [],
    onClick = () => {},
    noselect = false,
    value,
    disabled = false
  } = props

  const handleClick = (current) => {
    onRadioChange(current.value)
  }

  const handleInput = ({ detail: { value } }) => {
    onChange(value)
  }

  const renderSelectorContent = mode === 'selector' && !noselect && (
    <View className='comps-cell_selector' onClick={disabled ? () => {} : onClick}>
      {!value ? (
        <View className='view-flex view-flex-middle'>
          <Text className='text'>请选择</Text>
          <Text className='iconfont icon-qianwang-01'></Text>
        </View>
      ) : (
        value
      )}
    </View>
  )
  const renderRadioContent = mode === 'radio' && (
    <View className='comps-cell_radio'>
      <RadioGroup options={radioOptions} value={value} onClick={handleClick} />
    </View>
  )
  const renderInputContent = mode === 'input' && (
    <View className='comps-cell_input'>
      <Input
        className='input'
        placeholder={placeholder}
        placeholderClass='placeholder-class'
        value={value}
        onInput={handleInput}
      />
    </View>
  )
  const renderAreaContent = mode === 'area' && (
    <SpPickerAddress
      value={value}
      onChange={onChange}
    />
    // <Picker
    //   mode='multiSelector'
    //   range={areaList}
    //   onChange={onChange}
    //   onColumnChange={onColumnChange}
    // >
    //   {selectArea.length === 0 ? (
    //     <View className='comps-cell_selector'>
    //       <Text className='text'>请选择</Text>
    //       <Text className='icon icon-qianwang-01'></Text>
    //     </View>
    //   ) : (
    //     <View className='comps-cell_selector'>
    //       {`${selectArea[0]},${selectArea[1]},${selectArea[2]}`}
    //     </View>
    //   )}
    // </Picker>
  )

  return (
    <View className={classNames('comps-cell', className, { disabled, noselect })}>
      {required && <Text className='comps-cell-required'>*</Text>}
      <View
        className={classNames('comps-cell_title', { 'is-show': onlyShow })}
        onClick={noselect ? onClick : () => {}}
      >
        <View className='title'>{title}</View>
      </View>
      <View className='comps-cell_flex'>
        {renderSelectorContent}
        {renderRadioContent}
        {renderInputContent}
        {renderAreaContent}
      </View>
    </View>
  )
}

const InputComponent = (props) => {
  const {
    prefix = null,
    suffix = null,
    placeholder = '请输入...',
    className = '',
    onChange = () => {}
  } = props

  const [value, setValue] = useState('')

  const handleInput = ({ detail: { value } }) => {
    setValue(value)
  }

  useDepChange(() => {
    onChange(value)
  }, [value])

  return (
    <View className={classNames('comps-input', className)}>
      <View className='comps-input-prefix'>
        {typeof prefix === 'function' ? prefix(value) : prefix}
      </View>
      <View className='comps-input-wrapper'>
        <Input
          className='real-input'
          value={value}
          onInput={handleInput}
          placeholder={placeholder}
        />
      </View>
      <View className='comps-input-suffix'>{suffix}</View>
    </View>
  )
}

const NavBar = (props) => {
  const {
    title = '',
    canBack = true,
    canLogout = true,
    onBack = () => {
      Taro.navigateBack()
    },
    onLogout = () => {}
  } = props

  const handleLogout = async () => {
    const { confirm } = await Taro.showModal({
      title: '提示',
      content: '请确认是否退出此账号',
      showCancel: true,
      cancel: '取消',
      confirmText: '确认',
      confirmColor: 'rgba(244, 129, 31, 1)'
    })
    if (!confirm) {
      return
    }
    S.logout()
    onLogout?.()
    // eslint-disable-next-line
    Taro.redirectTo({
      url: '/subpages/merchant/login'
    })
  }

  return (
    <View className='comps-nav-bar'>
      <View className='left'>
        {canBack && (
          <View className='left-button' onClick={onBack}>
            <Text className='iconfont icon-fanhui'></Text>
          </View>
        )}
      </View>
      <View className='center'>{title}</View>
      <View className='right'>
        {canLogout && (
          <View className='right-button' onClick={handleLogout}>
            <Text className='iconfont icon-tuichu-01'></Text>
          </View>
        )}
      </View>
    </View>
  )
}

const Step = (props) => {
  const { className, options = [], step = 1 } = props

  const isActive = (index) => step === index + 1

  const isFinish = (index) => step > index + 1

  return (
    <View className={classNames('comps-step', className)}>
      {options.map((item, index) => (
        <View className={classNames('comps-step-item', { 'active': isActive(index) })} key={index}>
          {item}
          {
            <View
              className={classNames('comps-step-item-line', {
                'is-active': isActive(index),
                'is-finish': isFinish(index)
              })}
            ></View>
          }
        </View>
      ))}
    </View>
  )
}

Cell.options = {
  addGlobalClass: true
}

Button.options = {
  addGlobalClass: true
}

Radio.options = {
  addGlobalClass: true
}

RadioGroup.options = {
  addGlobalClass: true
}

InputComponent.options = {
  addGlobalClass: true
}

NavBar.options = {
  addGlobalClass: true
}

Step.options = {
  addGlobalClass: true
}

export {
  Button as MButton,
  Radio as MRadio,
  RadioGroup as MRadioGroup,
  Cell as MCell,
  InputComponent as MInput,
  NavBar as MNavBar,
  Step as MStep
}
