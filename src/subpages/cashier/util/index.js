import Taro from '@tarojs/taro'

export const SYMBOL = 'alipay_submit_div'

//删除支付宝之前的form表单
export function deleteForm() {
  //针对华为无法删除根节点的支付宝form表单
  let forms = document.getElementsByClassName(SYMBOL)

  while (forms.length) {
    document.body.removeChild(forms[0])
  }
}
