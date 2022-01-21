import { useImmer } from 'use-immer'
import { useEffect, useCallback } from 'react'

const useStateSyncCallback = (callback) => {
  const [state, setState] = useImmer({ current: false })
  const { current } = state

  const Func = useCallback(() => {
    setState((draft) => {
      draft.current = true
    })
  }, [state])

  useEffect(() => {
    if (current === true) setState({ current: false })
  }, [state])

  useEffect(() => {
    current && callback()
  })

  return Func
}

export default useStateSyncCallback

// useStateCallback(initState){

//   const [state,setState]=useImmer(initState);

//   const successCallback=useRef(null)

//   function successStateCallback(func,callback){
//     setState(func);
//     successCallback.current=callback;
//   }

//   useEffect(()=>{
//     successCallback.current?.(state)
//   },[state]);

//   return [
//     state,
//     successStateCallback
//   ]

// }
