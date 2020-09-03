import { combineReducers } from 'redux'

import {
  SET_TOKENS
} from '../actions'


const coinbaseTokens = (state = {}, action) => {
  switch (action.type) {
    case SET_TOKENS:
      return {
        ...state,
        coinbaseAccessToken: action.tokens.coinbaseAccessToken,
        errorStatusCode: action.tokens.errorStatusCode
      }
    default:
      return state
  }
}


const rootReducer = combineReducers({
  coinbaseTokens
})

export default rootReducer

