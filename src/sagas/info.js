import { all, call, put, take } from "redux-saga/effects";

import infoApi from "../api/info";
import {
  FETCH_ALL_INFORMATION_FAILED,
  FETCH_ALL_INFORMATION_REQUESTED,
  FETCH_ALL_INFORMATION_SUCCEED,
  FETCH_COLLEGE_RANK_FAILED,
  FETCH_COLLEGE_RANK_REQUETED,
  FETCH_COLLEGE_RANK_SUCCEED,
  FETCH_SCHOOL_RANK_FAILED,
  FETCH_SCHOOL_RANK_REQUETED,
  FETCH_SCHOOL_RANK_SUCCEED,
  FETCH_TOTAL_RANK_FAILED,
  FETCH_TOTAL_RANK_REQUETED,
  FETCH_TOTAL_RANK_SUCCEED,
  KNOWLEDGE_INFORMATION_FAILED,
  KNOWLEDGE_INFORMATION_REQUESTED,
  KNOWLEDGE_INFORMATION_SUCCEED,
  RANK_INFORMATION_FAILED,
  RANK_INFORMATION_REQUESTED,
  RANK_INFORMATION_SUCCEED,
  SEASON_INFORMATION_FAILED,
  SEASON_INFORMATION_REQUESTED,
  SEASON_INFORMATION_SUCCEED
} from "../constants/info";

export function* fetchInformationSaga() {
  while (yield take(FETCH_ALL_INFORMATION_REQUESTED)) {
    try {
      const {
        data: { data, success, ...err }
      } = yield call(infoApi.allInformation);
      if (success) {
        yield put({
          type: FETCH_ALL_INFORMATION_SUCCEED,
          payload: data
        });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({
        type: FETCH_ALL_INFORMATION_FAILED,
        error: error.message
      });
    }
  }
}

export function* knowledgeInformationSaga() {
  while (yield take(KNOWLEDGE_INFORMATION_REQUESTED)) {
    try {
      const {
        data: { data, success, ...err }
      } = yield call(infoApi.knowledgeInformation);
      if (success) {
        yield put({
          type: KNOWLEDGE_INFORMATION_SUCCEED,
          payload: data
        });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({
        type: KNOWLEDGE_INFORMATION_FAILED,
        error: error.message
      });
    }
  }
}

export function* rankInfomationSaga() {
  while (yield take(RANK_INFORMATION_REQUESTED)) {
    try {
      const {
        data: { data, success, ...err }
      } = yield call(infoApi.rankInformation);
      if (success) {
        yield put({
          type: RANK_INFORMATION_SUCCEED,
          payload: data
        });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({
        type: RANK_INFORMATION_FAILED,
        error: error.message
      });
    }
  }
}

export function* seasonInformationSaga() {
  while (yield take(SEASON_INFORMATION_REQUESTED)) {
    try {
      const {
        data: { data, success, ...err }
      } = yield call(infoApi.seasonInformation);
      if (success) {
        yield put({
          type: SEASON_INFORMATION_SUCCEED,
          season: data[0], // 第一个是最新的赛季信息
          seasons: data
        });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({
        type: SEASON_INFORMATION_FAILED,
        error: JSON.stringify(error)
      });
    }
  }
}

export function* totalRankSaga() {
  while (true) {
    try {
      const { n } = yield take(FETCH_TOTAL_RANK_REQUETED);
      const {
        data: { data, success, err }
      } = yield call(infoApi.totalRank, n);
      if (success) {
        yield put({ type: FETCH_TOTAL_RANK_SUCCEED, payload: data });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({
        type: FETCH_TOTAL_RANK_FAILED,
        error: error.message
      });
    }
  }
}

export function* schoolRankSaga() {
  while (yield take(FETCH_SCHOOL_RANK_REQUETED)) {
    try {
      const {
        data: { data, success, err }
      } = yield call(infoApi.schoolRank);
      if (success) {
        yield put({ type: FETCH_SCHOOL_RANK_SUCCEED, payload: data });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({
        type: FETCH_SCHOOL_RANK_FAILED,
        error: error.message
      });
    }
  }
}

export function* collegeSaga() {
  while (yield take(FETCH_COLLEGE_RANK_REQUETED)) {
    try {
      const {
        data: { data, success, err }
      } = yield call(infoApi.collegeRank);
      if (success) {
        yield put({ type: FETCH_COLLEGE_RANK_SUCCEED, payload: data });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({
        type: FETCH_COLLEGE_RANK_FAILED,
        error: error.message
      });
    }
  }
}

export function* infoSaga() {
  yield all([
    fetchInformationSaga(),
    knowledgeInformationSaga(),
    rankInfomationSaga(),
    seasonInformationSaga(),
    totalRankSaga(),
    schoolRankSaga(),
    collegeSaga()
  ]);
}
