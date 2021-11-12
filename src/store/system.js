import { createReducer } from 'redux-create-reducer'
import { DEFAULT_THEME, DEFAULT_POINT_NAME } from '@/consts'

const { colorPrimary, colorMarketing, colorAccent } = DEFAULT_THEME

const initState = {
  colorPrimary: colorPrimary,
  colorMarketing: colorMarketing,
  colorAccent: colorAccent,
  pointName: DEFAULT_POINT_NAME
}

const system = createReducer(initState, {
  ['system/config'](state, action) {
    const payload = action.payload
    return {
      ...state,
      ...payload
    }
  }
})

export default system
