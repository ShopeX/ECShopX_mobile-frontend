import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Taro, { usePageScroll, getCurrentInstance } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { SpNavBar, SpFloatMenuItem } from "@/components";
import { classNames, styleNames, hasNavbar } from "@/utils";

import "./index.scss";

function SpPage( props ) {
  const $instance = getCurrentInstance();
  debugger
  const { className, children, renderFloat, scrollToTopBtn = false } = props;
  const sys = useSelector( ( state ) => state.sys );
  const [showToTop, setShowToTop] = useState(false);
  const { colorPrimary, colorMarketing, colorAccent, rgb, tabbar } = sys;
  const pageTheme = {
    "--color-primary": colorPrimary,
    "--color-marketing": colorMarketing,
    "--color-accent": colorAccent,
    "--color-rgb": rgb,
  };

  usePageScroll((res) => {
    if (res.scrollTop > 300) {
      setShowToTop(true);
    } else {
      setShowToTop(false);
    }
  } );
  
  const scrollToTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
    });
  }

  debugger
  // console.log('hasNavbar:', hasNavbar, pageTheme)
  return (
    <View
      className={classNames("sp-page", className, {
        "has-navbar": hasNavbar,
      })}
      style={styleNames(pageTheme)}
    >
      {hasNavbar && <SpNavBar />}
      <View className="sp-page-body">{children}</View>

      {/* 浮动 */}
      <View className="float-container">
        {showToTop &&
          scrollToTopBtn && (
            <SpFloatMenuItem onClick={scrollToTop}>
              <Text className="iconfont icon-arrow-up"></Text>
            </SpFloatMenuItem>
          )}
        {renderFloat}
      </View>
    </View>
  );
}

export default SpPage;
