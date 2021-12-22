import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { SpFloatMenus, SpFloatMenuItem, SpFloatAd } from '@/components'
import "./comp-floatmenu.scss";

function CompFloatMenu(props) {
  return (
    <SpFloatMenus className="comp-floatmenu">
      <SpFloatMenuItem>
        <SpFloatAd />
      </SpFloatMenuItem>
      <SpFloatMenuItem>
        
      </SpFloatMenuItem>
    </SpFloatMenus>
  );
}

CompFloatMenu.options = {
  addGlobalClass: true,
};

export default CompFloatMenu;
