import React from "react";
import { View } from "@tarojs/components";
import './index.scss'

function SpSelect(props) {
  const { info = [] } = props;
  return (
    <View className="sp-select">
      {info.map((item) => (
        <View className="select-item" key={`select-item__${item.id}`}>
          {item.name}
        </View>
      ))}
    </View>
  );
}

export default SpSelect;
