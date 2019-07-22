import {
  CLOSE_AUTHORIZATION_WINDOW,
  GET_USER_INFO_SUCCEED,
  GET_WX_CODE_SUCCEED,
  LOGIN_SUCCEED,
  SHOW_AUTHORIZATION_WINDOW,
  FETCH_OPPONENT_INFO_SUCCEEDED,
  CLEAR_OPPONENT_INFO
} from "../constants/user";

export const initialUser = {
  avatar: null,
  nickName: "",
  gender: null,
  wxCode: null,
  modified: null,
  token: null,
  openId: null,
  shouldShowAuthorizationWindow: false,
  opponentInfo: {}
};

export default function user(state = initialUser, action) {
  switch (action.type) {
    case GET_WX_CODE_SUCCEED:
      return {
        ...state,
        wxCode: action.wxCode
      };
    case GET_USER_INFO_SUCCEED:
      return {
        ...state,
        avatar: action.userInfo.avatarUrl,
        nickName: action.userInfo.nickName,
        gender: action.userInfo.gender,
        shouldShowAuthorizationWindow: false
      };
    case LOGIN_SUCCEED:
      return {
        ...state,
        modified: action.userInfo.modified,
        token: action.userInfo.token,
        openId: action.userInfo.openId,
        level: action.userInfo.level,
        school: action.userInfo.school,
        college: action.userInfo.college,
        studentId: action.userInfo.studentId
      };
    case SHOW_AUTHORIZATION_WINDOW:
      return {
        ...state,
        shouldShowAuthorizationWindow: true
      };
    case CLOSE_AUTHORIZATION_WINDOW:
      return {
        ...state,
        shouldShowAuthorizationWindow: false
      };
    case CLEAR_OPPONENT_INFO:
      return {
        ...state,
        opponentInfo: {}
      };
    case FETCH_OPPONENT_INFO_SUCCEEDED:
      return {
        ...state,
        opponentInfo: action.opponentInfo
      };
    default:
      return state;
  }
}
