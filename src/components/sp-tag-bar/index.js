import React, { useState } from "react";
import { View, ScrollView } from "@tarojs/components";
import { classNames } from "@/utils";

import "./index.scss";

function SpTagBar(props) {
  const { list, value, children, onChange = () => {} } = props;

  return (
    <View className="sp-tag-bar">
      <View className="tag-bar-hd">
        <ScrollView className="tag-container" scrollX>
          {list.map((item, index) => (
            <View
              className={classNames("tag-item", {
                active: value === index
              })}
              onClick={() => {
                onChange(index);
              }}
              key={`tag-item__${item.tag_id}`}
            >
              {item.tag_name}
            </View>
          ))}
        </ScrollView>
      </View>
      <View className="tag-bar-ft">{children}</View>
    </View>
  );
}

SpTagBar.options = {
  addGlobalClass: true,
};

export default SpTagBar;
