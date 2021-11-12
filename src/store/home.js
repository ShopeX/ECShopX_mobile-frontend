import { createReducer } from 'redux-create-reducer'

const initState = {
  homesearchfocus: null,
  showhometabbar: true,
  tabSet: null,
  nearshopinfo: null,
  isShowPopupTempalte: false,
  innitShowPopupTempalte: true,
  tagNavigationTop: [],
  scrollTop: 0,
  activityMenu: null,
  showHeadUserInfo: true,
  userinfo: {},
  custompageActivityMenu: null
}

const home = createReducer(initState, {
  ['home/homesearchfocus'] (state, action) {
    const homesearchfocus = action.payload

    return {
      ...state,
      homesearchfocus
    }
  },
  ['home/showhometabbar'] (state, action) {
    const showhometabbar = action.payload
    return {
      ...state,
      showhometabbar
    }
  },
  ['home/tabSet'] (state, action) {
    const tabSet = action.payload.item
    return {
      ...state,
      tabSet
    }
  },
  ['home/nearshopinfo'] (state, action) {
    const nearshopinfo = action.payload
    return {
      ...state,
      nearshopinfo
    }
  },
  ['home/homepopup'] (state, action) {
    return {
      ...state,
      isShowPopupTempalte: action.payload.isShowPopupTempalte,
      innitShowPopupTempalte: action.payload.innitShowPopupTempalte
    }
  },

  ['home/activityMenu'] (state, action) {
    return {
      ...state,
      activityMenu: action.payload
    }
  },
  ['home/userinfo'] (state, action) {
    return {
      ...state,
      userinfo: action.payload
    }
  },
  ['custompage/activityMenu'] (state, action) {
    return {
      ...state,
      custompageActivityMenu: action.payload
    }
  }
})

export default home
