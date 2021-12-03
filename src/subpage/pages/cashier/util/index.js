

export const SYMBOL='alipay_submit_div';

//删除支付宝之前的form表单
export function deleteForm(){
    let forms=document.getElementsByClassName(SYMBOL);

    while(forms.length){
        document.body.removeChild(forms[0]);
    }
}