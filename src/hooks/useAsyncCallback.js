import { useState, useRef, useEffect } from 'react'
import { useImmer } from 'use-immer'

export default (props) => {
  const [state, setState] = useImmer(props)
  const callbackRef = useRef()

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state)
    }
  }, [state])

  const setStateAsync = (fn, callback) => {
    setState(fn)
    callbackRef.current = callback
  }

  return [state, setStateAsync]
}
