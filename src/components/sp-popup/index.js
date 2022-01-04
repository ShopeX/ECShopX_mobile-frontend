import Taro from '@tarojs/taro'
import { classNames } from '@/utils'
import { View } from '@tarojs/components'
import './index.scss'

const Popup = (props) => {
  const {
    borderRadius = false,
    height,
    width = '320px',
    visible = false,
    children,
    onClose = () => {},
    right = false,
    className
  } = props

  const handleClose = (e) => {
    onClose(e)
  }

  return (
    <View
      className={classNames('sp-popup', { ['visible']: visible, ['right']: right })}
      catchTouchmove
    >
      <View className='sp-popup-overlay' onClick={handleClose}></View>
      <View
        style={right ? { width } : { height }}
        className={classNames(
          'sp-popup-container',
          {
            'borderradius': borderRadius
          },
          className
        )}
      >
        {children}
      </View>
    </View>
  )
}

export default Popup
