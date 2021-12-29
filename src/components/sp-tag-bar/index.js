import React, { useState } from "react";
import { View, ScrollView } from "@tarojs/components";
import { classNames } from "@/utils";

import "./index.scss";

function SpTagBar(props) {
  const { list, value, children, onChange = () => {} } = props;

  const [ plus, setPlus ] = useState(true)

  const isChecked = (item)=>{
    return item.value === value || item.plusValue === value || item.minusValue === value;
  }

  const handleClickLabel = (item) => {
    const sortFunc = (item) => {
      if(item.value || item.value == 0 ){
        res = item.value
      } else {
        if (plus) {
          res = item.minusValue
        } else {
          res = item.plusValue
        }
      } 
    }
    let res = 0
    //如果是选中的
    if (isChecked(item)) {
      sortFunc(item)
    } else {
      sortFunc(item)
    }
    setPlus(!plus)
    onChange(res)
  }

  return (
    <View className="sp-tag-bar">
      <View className="tag-bar-hd">
        <ScrollView className="tag-container" scrollX>
          {list.map((item, index) => (
            <View
              className={classNames("tag-item", {
                active: isChecked(item)
              })}
              onClick={() => {
                handleClickLabel(item)
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
