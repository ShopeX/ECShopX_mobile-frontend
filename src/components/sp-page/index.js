import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Taro, { usePageScroll } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { SpNavBar, SpFloatMenuItem } from "@/components";
import { classNames, styleNames, hasNavbar } from "@/utils";

import "./index.scss";

function SpPage(props) {
  const { className, children, renderFloat } = props;
  const sys = useSelector((state) => state.sys);
  const [showToTop, setShowToTop] = useState(false);
  const { colorPrimary, colorMarketing, colorAccent, rgb } = sys;
  const pageTheme = {
    "--color-primary": colorPrimary,
    "--color-marketing": colorMarketing,
    "--color-accent": colorAccent,
    "--color-rgb": rgb,
  };

  usePageScroll((res) => {
    console.log(1, res.scrollTop);
    if (res.scrollTop > 300) {
      setShowToTop(true);
    } else {
      setShowToTop(false);
    }
  } );
  
  const scrollToTop = () => {
    debugger
    Taro.scrollToTop(0)
  }
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
        {showToTop && (
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
