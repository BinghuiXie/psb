import {
  GET_USER_INFO,
  GET_WX_CODE,
  LOGIN,
  LOGIN_SUCCEED,
  FETCH_OPPONENT_INFO_REQUESTED,
  CLEAR_OPPONENT_INFO
} from "../constants/user";

export const getWxCode = () => ({ type: GET_WX_CODE });
export const getUserInfo = () => ({ type: GET_USER_INFO });
export const login = () => ({ type: LOGIN });
export const updateInfo = userInfo => ({ type: LOGIN_SUCCEED, userInfo });
export const getOpponentInfo = () => ({ type: FETCH_OPPONENT_INFO_REQUESTED });
export const clearOpponentInfo = () => ({ type: CLEAR_OPPONENT_INFO });
