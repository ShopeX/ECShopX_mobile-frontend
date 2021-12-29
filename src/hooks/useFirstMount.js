import { useState, useRef, useEffect } from "react";

export default (props) => {
    //是否渲染完成
    const mounted=useRef(false);

    useEffect(() => {
        mounted.current=true;
    }, []);

    return mounted.current;
}
