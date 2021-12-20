import Taro, { useEffect, useRef } from '@tarojs/taro' 

export default function useFirstMount(props){
    //是否渲染完成
    const mounted=useRef(false);

    useEffect(() => {
        mounted.current=true;
    }, []);

    return mounted.current;
}
