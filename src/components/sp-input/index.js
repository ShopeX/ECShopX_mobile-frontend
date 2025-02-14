import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Input } from "@tarojs/components"
import { classNames } from "@/utils"
import "./index.scss";


function SpInput(props) {
  const [cursor, setCursor] = useState(-1)

  useEffect(() => {
    setCursor(props.value.length)
  }, [props.value])

  const handleInput = (e) => {
    console.log('sp-input', e)
    setCursor(e.detail.cursor)
    props.onChange(e.detail.value)
  }


  return <Input className={classNames("sp-input", props.className)} value={props.value} maxLength={props.maxLength} placeholder={props.placeholder} cursor={cursor} onInput={handleInput}>
  </Input>;
}

SpInput.options = {
  addGlobalClass: true
}

SpInput.defaultProps = {
  className: '',
  value: '',
  placeholder: '',
  maxLength: null,
  onChange: () => { }
}

export default SpInput
