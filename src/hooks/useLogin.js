import Taro, { useState, useEffect } from "@tarojs/taro";
import { STORAGE_TOKEN } from "@/consts/localstorage";

export default props => {
  const [isLogin, setIsLogin] = useState(false)

  useEffect( () => {
    const token = Taro.getStorageSync( STORAGE_TOKEN );
    setIsLogin(!!token)
  }, [])

  return {
    isLogin
  };
};
