import { all, call, put, select, take } from "redux-saga/effects";

import newsApi from "../api/news";
import {
  FETCH_MORE_NEWS_FAILED,
  FETCH_MORE_NEWS_REQUESTED,
  FETCH_NEWS_FAILED,
  FETCH_NEWS_REQUESTED,
  FETCH_NEWS_SUCCEED,
  NEXT_PAGE
} from "../constants/news";

export function* fetchNewsSaga() {
  while (yield take(FETCH_NEWS_REQUESTED)) {
    try {
      const { page, size } = yield select(state => state.news);
      const {
        data: { data, success, error }
      } = yield call(newsApi.getNews, { page, size });
      if (success) {
        yield put({
          type: FETCH_NEWS_SUCCEED,
          news: data.notificationDos,
          sum: data.sum
        });
      } else {
        throw new Error(JSON.stringify(error));
      }
    } catch (error) {
      yield put({ type: FETCH_NEWS_FAILED, error: error.message });
    }
  }
}

export function* fetchMoreNewsSaga() {
  while (yield take(FETCH_MORE_NEWS_REQUESTED)) {
    try {
      const { page, size, sum } = yield select(state => state.news);
      if (page * size < sum) {
        yield put({ type: NEXT_PAGE });
        yield put({ FETCH_NEWS_REQUESTED });
      }
    } catch (e) {
      yield put({ type: FETCH_MORE_NEWS_FAILED, error: e });
    }
  }
}

export function* newsSaga() {
  yield all([fetchNewsSaga()]);
}
