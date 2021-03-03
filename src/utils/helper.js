
export const transformTextByPoint=(isPoint=false,money,point)=>{
    if(isPoint){
        return ` ${point}积分`
    } 
    return ` ￥${money}`
}