import React, { useState } from "react";
import { View, ScrollView } from "@tarojs/components";
import { classNames } from "@/utils";

import "./index.scss";

function SpTagBar(props) {
  const { list, children } = props;
  const [ curId, setCurId] = useState(0)

  return (
    <View className="sp-tag-bar">
      <View className="tag-bar-hd">
        <ScrollView className='tag-container' scrollX>
          {list.map((item, index) => (
            <View
              className={classNames("tag-item", {
                active: curId === item.id,
              })}
              onClick={() => {
                setCurId(index);
              }}
              key={`tag-item__${item.id}`}
            >
              {item.label}
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

export default React.memo(SpTagBar);
