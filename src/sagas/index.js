import { all } from "redux-saga/effects";

import challengeSaga from "./challenge";
import exerciseSaga from "./exercise";
import { infoSaga } from "./info";
import matchSaga from "./match";
import { newsSaga } from "./news";
import rankSaga from "./rank";
import userSaga from "./user";

function* helloSaga() {
  console.log("START SAGA!");
}

export default function* rootSaga() {
  yield all([
    helloSaga(),
    exerciseSaga(),
    userSaga(),
    infoSaga(),
    newsSaga(),
    rankSaga(),
    challengeSaga(),
    matchSaga()
  ]);
}
