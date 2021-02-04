 
function calcDecimalLength(decimal){//计算数值的方法
    var splitArray=decimal.toString().split(".");
    if(splitArray.length===1){
        return 0;
    }
    return splitArray[1].length;
}
function calcMax(a,b){//计算相乘的倍数
    let aLength=calcDecimalLength(a);
    let bLength=calcDecimalLength(b);
    let max=Math.pow(10,Math.max(aLength,bLength));
    return max;
}
export function diviCalc(a,b){//除法计算
    let max=calcMax(a,b);
    return ((a*max)/(b*max));
} 