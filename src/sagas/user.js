import Taro from "@tarojs/taro";
import { all, call, put, select, take } from "redux-saga/effects";

import userApi from "../api/user";
import {
  FETCH_ALL_INFORMATION_REQUESTED,
  FETCH_TOTAL_RANK_REQUETED
} from "../constants/info";
import { FETCH_NEWS_REQUESTED } from "../constants/news";
import {
  GET_USER_INFO,
  GET_USER_INFO_FAILED,
  GET_USER_INFO_SUCCEED,
  GET_WX_CODE,
  GET_WX_CODE_FAILED,
  GET_WX_CODE_SUCCEED,
  LOGIN,
  LOGIN_FAILED,
  LOGIN_SUCCEED,
  SHOW_AUTHORIZATION_WINDOW,
  FETCH_OPPONENT_INFO_REQUESTED,
  FETCH_OPPONENT_INFO_SUCCEEDED,
  FETCH_OPPONENT_INFO_FAILED
} from "../constants/user";
import userSelector from "../select/user";

/**
 * 登录流程
 * 1. 进页面
 *    b. 拿 wxCode
 *    a. 同时拿 avatar 和 nickName，如果没有授权的话弹窗；之后都不用弹
 * 2. 调用后端的 login 接口
 */
export function* getWxCodeSaga() {
  while (true) {
    yield take(GET_WX_CODE);
    try {
      const { code: wxCode } = yield call(Taro.login, { timeout: 5000 });
      yield put({ type: GET_WX_CODE_SUCCEED, wxCode });
    } catch (e) {
      yield put({ type: GET_WX_CODE_FAILED, error: e });
      // 错误原因超时，重试获取
      if (e.errMsg === "request timeout") {
        yield put({ type: GET_WX_CODE });
      }
    } finally {
      // 微信可能获取用户信息失败，然后不懂为啥直接 GET_WX_CODE 重试，会没反应
      // 只好到 LOGIN 里去重试了
      yield put({ type: LOGIN });
    }
  }
}

export function* getUserInfoSaga() {
  while (true) {
    yield take(GET_USER_INFO);
    try {
      const { userInfo } = yield call(Taro.getUserInfo, { timeout: 5000 });
      yield put({ type: GET_USER_INFO_SUCCEED, userInfo });
    } catch (e) {
      yield put({ type: GET_USER_INFO_FAILED, error: e });
      yield put({ type: SHOW_AUTHORIZATION_WINDOW });
      // const { authSetting } = yield call(Taro.getSetting,  { timeout: 5000 });
      // if (authSetting && !authSetting["scope.userInfo"]) {
      //   // 如果没有拿到用户信息，就弹窗授权
      //   yield put({ type: SHOW_AUTHORIZATION_WINDOW });
      // }
      if (e.errMsg.includes("unauthorized")) {
        yield put({ type: SHOW_AUTHORIZATION_WINDOW });
      }
      // 错误原因超时，重试获取
      if (e.errMsg.includes("timeout")) {
        yield put({ type: GET_USER_INFO });
      }
    } finally {
      // 微信可能获取用户信息失败，然后不懂为啥直接 GET_USER_INFO 重试，会没反应
      // 只好到 LOGIN 里去重试了
      const { shouldShowAuthorizationWindow } = yield select(
        state => state.user
      );
      // 防止因为 unauthorized 重试一堆
      if (!shouldShowAuthorizationWindow) {
        yield put({ type: LOGIN });
      }
    }
  }
}

export function* loginSaga() {
  while (true) {
    yield take(LOGIN);
    const { wxCode, avatar, nickName } = {
      wxCode: yield select(userSelector.getWxCode),
      avatar: yield select(userSelector.getUserAvatar),
      nickName: yield select(userSelector.getUserNickName)
    };
    // 如果没有这仨，那就没法登录了
    if (!wxCode || !avatar || !nickName) {
      if (!wxCode) {
        yield put({ type: GET_WX_CODE });
      }
      if (!avatar) {
        yield put({ type: GET_USER_INFO });
      }
      continue;
    }
    try {
      const {
        data: { data: userInfo, success, ...err }
      } = yield call(userApi.login, { avatar, nickName, wxCode });
      if (success) {
        yield call(Taro.setStorageSync, "token", userInfo.token);
        yield put({ type: LOGIN_SUCCEED, userInfo });
        if (userInfo.modified) {
          yield put({ type: FETCH_ALL_INFORMATION_REQUESTED }); // 获取所有赛季相关信息
          yield put({ type: FETCH_NEWS_REQUESTED }); // 获取资讯
          yield put({ type: FETCH_TOTAL_RANK_REQUETED, n: 5 }); // 获取排名信息
        }
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (e) {
      yield put({ type: LOGIN_FAILED, error: e.message });
    }
  }
}

export function* getOpponentInfo() {
  while (yield take(FETCH_OPPONENT_INFO_REQUESTED)) {
    try {
      const {
        data: { data, success, ...err }
      } = yield call(userApi.getAvatar);
      if (success) {
        yield put({
          type: FETCH_OPPONENT_INFO_SUCCEEDED,
          opponentInfo: data
        });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({ type: FETCH_OPPONENT_INFO_FAILED, error: error.message });
    }
  }
}

export default function* userSaga() {
  yield all([
    loginSaga(),
    getWxCodeSaga(),
    getUserInfoSaga(),
    getOpponentInfo()
  ]);
}
