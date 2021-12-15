import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { View } from '@tarojs/components'
import { SpNavBar } from '@/components' 
import { classNames, styleNames, hasNavbar } from '@/utils'

import './index.scss'

function SpPage( props ) {
  const { className, children } = props
  const sys = useSelector((state) => state.sys)
  const { colorPrimary, colorMarketing, colorAccent } = sys
  const pageTheme = {
    '--color-primary': colorPrimary,
    '--color-marketing': colorMarketing,
    '--color-accent': colorAccent
  }
  // console.log('hasNavbar:', hasNavbar, pageTheme)
  return (
    <View className={classNames( "sp-page", className, {
      "has-navbar": hasNavbar
    } )} style={styleNames( pageTheme )}>
      { hasNavbar && <SpNavBar /> }
      <View className="sp-page-body">
        {children}
      </View>
    </View>
  );
}

export default SpPage;
