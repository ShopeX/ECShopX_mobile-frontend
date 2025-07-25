import React, { useContext } from 'react'
import { View, Text } from '@tarojs/components'
import { SpImage, SpLogin } from '@/components'
import { linkPage, classNames, styleNames, isString, isArray, pxToUnitRpx } from '@/utils'
import { needLoginPage, needLoginPageType } from '@/consts'
import './imghot-zone.scss'

function WgtImgHotZone(props) {
  const { info } = props
  const { base, config, data, distributor_id } = info

  const handleClickItem = linkPage

  return (
    <View
      className={classNames('wgt wgt-imghot-zone', {
        wgt__padded: base.padded
      })}
    >
      {base.title && (
        <View className='wgt-head'>
          <View className='wgt-hd'>
            <Text className='wgt-title'>{base.title}</Text>
            <Text className='wgt-subtitle'>{base.subtitle}</Text>
          </View>
        </View>
      )}

      <View className={`slider-wra wgt-body img-hotzone ${config.padded ? 'padded' : ''}`}>
        <SpImage img-class='img-hotzone_img' src={config.imgUrl} lazyLoad />
        {isArray(data) &&
          data.map((item, index) => {
            //TODO 后期可以使用provider 将事件上报给根组件进行登录后跳转的动作
            if (
              item.id == 'purchase' ||
              ['purchase_activity', 'regactivity', 'lottery'].includes(item.linkPage)
            ) {
              return (
                <SpLogin
                  key={`imghotzonr-${index}`}
                  onChange={handleClickItem.bind(this, {
                    ...item,
                    distributor_id
                  })}
                >
                  <View
                    key={`${index}1`}
                    className='img-hotzone_zone'
                    style={styleNames({
                      width: `${item.widthPer * 100}%`,
                      height: `${item.heightPer * 100}%`,
                      top: `${item.topPer * 100}%`,
                      left: `${item.leftPer * 100}%`
                    })}
                  />
                </SpLogin>
              )
            } else {
              return (
                <View
                  key={`${index}1`}
                  className='img-hotzone_zone'
                  style={styleNames({
                    width: `${item.widthPer * 100}%`,
                    height: `${item.heightPer * 100}%`,
                    top: `${item.topPer * 100}%`,
                    left: `${item.leftPer * 100}%`
                  })}
                  onClick={handleClickItem.bind(this, {
                    ...item,
                    distributor_id
                  })}
                />
              )
            }
          })}
      </View>
    </View>
  )
}

WgtImgHotZone.options = {
  addGlobalClass: true
}

WgtImgHotZone.defaultProps = {
  info: null
}

export default WgtImgHotZone
