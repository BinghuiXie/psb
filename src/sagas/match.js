import Taro from "@tarojs/taro";
import {
  all,
  call,
  cancel,
  cancelled,
  delay,
  fork,
  put,
  select,
  take,
  takeLatest
} from "redux-saga/effects";

import { crypto } from "../api";
import matchApi from "../api/match";
import rankApi from "../api/rank";
import {
  ADD_CHOICE,
  ADD_USER_ANSWERS,
  CHANGE_CHOICE,
  CHECK_MATCH_STATUS_FAILED,
  CHECK_MATCH_STATUS_REQUESTED,
  CHECK_MATCH_STATUS_SUCCEED,
  CONFIRM_CHOICE,
  DURATION,
  FAIL_COUNT_DONW,
  FAIL_TICK,
  FETCH_MATCH_HISTORY_FAILED,
  FETCH_MATCH_HISTORY_REQUESTED,
  FETCH_MATCH_HISTORY_SUCCEEDED,
  FETCH_QUESTIONS_FAILED,
  FETCH_QUESTIONS_REQUESTED,
  FETCH_QUESTIONS_SUCCEEDED,
  GAIN_SCORE,
  INIT_QUESTION_ITERATOR,
  JOIN_MATCH_FAILED,
  JOIN_MATCH_REQUESTED,
  JOIN_MATCH_SUCCESSED,
  NO_MORE_QUESTIONS,
  REQUEST_NEXT_QUESTION,
  RESET_COUNT_DOWN,
  RESET_MATCH_STATE,
  SCORE_GAIN_PER_QUESTION,
  SHOW_LOADING,
  SHOW_NEXT_QUESTION,
  START_COUNT_DOWN,
  STOP_COUNT_DOWN,
  STOP_EXAM,
  SUBMIT_USER_ANSWERS_REQUESTED,
  TICK,
  STOP_OPPONENT_SCORE,
  FAIL_OPPONENT_SCORE,
  OPPONENT_GAIN_SCORE,
  GUARANTEED_TIME,
  TIME_RATIO
} from "../constants/match";

const getMatch = ({ match }) => match;
const getUser = ({ user }) => user;
const getInfo = ({ info }) => info;

/**
 * 所有的流程：
 * 1. 进去先拿题目，
 * 2. 然后显示题目，
 * 3. 等待用户输入，
 * 4. 判断用户输入，
 * 5. 点错直接错，点对变绿，
 * 6. 确认按钮，进入下一题 (回到2)
 */

export function* tickSaga() {
  try {
    // 一秒 tick 一下
    while (true) {
      const { countDown, currentQuestionIndex, questions } = yield select(
        getMatch
      );
      if (countDown > 0) {
        yield delay(1000);
        yield put({ type: TICK });
      } else {
        yield put({ type: CONFIRM_CHOICE });
        if (currentQuestionIndex === questions.length) {
          yield put({ type: SUBMIT_USER_ANSWERS_REQUESTED });
        }
        break;
      }
    }
  } catch (e) {
    yield put({ type: FAIL_TICK, error: e });
  } finally {
    if (yield cancelled()) {
      yield put({ type: "STOP_COUNT_DOWN_MANUAL" });
    }
  }
}

/**
 * 打开新的一题的时候重新倒计时，
 * 点击题目的时候，终止本次倒计时
 *
 * put({ type: START_COUNT_DOWN })
 */
export function* countDownSaga() {
  // take: 开始倒计时
  while (yield take(START_COUNT_DOWN)) {
    try {
      yield put({ type: RESET_COUNT_DOWN, payload: DURATION }); // put: 初始化倒计时时间
      const tickTask = yield fork(tickSaga); // fork: 后台，倒计时计数
      yield take(STOP_COUNT_DOWN); // take: 停止倒计时
      yield cancel(tickTask); // cancel: 取消后台倒计时计数
    } catch (e) {
      yield put({ type: FAIL_COUNT_DONW, error: e });
    }
  }
}

/**
 * 获取题目们
 */
export function* fetchQuestionsDataSaga() {
  // take: 请求问题
  while (yield take(FETCH_QUESTIONS_REQUESTED)) {
    try {
      const {
        data: { data: encrypted, success, ...err }
      } = yield call(matchApi.fetchQuestions); // call: api 接口
      if (success) {
        const data = yield call(crypto.decrypt.bind(crypto), encrypted);
        yield put({ type: FETCH_QUESTIONS_SUCCEEDED, data: JSON.parse(data) }); // put: 获取问题成功
        yield call(initQuestionIterator);
        yield put({ type: REQUEST_NEXT_QUESTION });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({ type: FETCH_QUESTIONS_FAILED, error: error.message }); // put: 获取问题失败
    }
  }
}

/**
 * 获取题目迭代器
 */
function* getQuestionGenerator() {
  const { questions } = yield select(getMatch);
  return questions[Symbol.iterator]();
}

export function* initQuestionIterator() {
  return yield put({
    type: INIT_QUESTION_ITERATOR,
    questionIterator: yield call(getQuestionGenerator)
  });
}

/**
 * 显示下一题
 */
export function* showQuestionSaga() {
  // take: 请求下一个问题
  while (yield take(REQUEST_NEXT_QUESTION)) {
    try {
      yield put({ type: STOP_COUNT_DOWN });
      const { questionIterator } = yield select(getMatch);
      const { value: currentQuestion, done } = questionIterator.next();
      if (!done) {
        yield put({ type: SHOW_NEXT_QUESTION, currentQuestion }); // put: 显示下一个问题
        yield put({ type: START_COUNT_DOWN }); // 开始倒计时
      } else {
        yield put({ type: NO_MORE_QUESTIONS }); // put: 没有更多问题
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}

export function* changeChoiceSaga() {
  while (true) {
    try {
      const { choice } = yield take(CHANGE_CHOICE);
      const { confirmed } = yield select(getMatch);
      if (!confirmed) {
        yield put({ type: ADD_CHOICE, choice });

        // if (selectedChoices.includes(choice.id)) {
        //   yield put({ type: DELETE_CHOICE, choice });
        // } else {
        //   yield put({ type: ADD_CHOICE, choice });
        // }
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}

export function* confirmChoiceSaga() {
  while (yield take(CONFIRM_CHOICE)) {
    try {
      yield put({ type: STOP_COUNT_DOWN });
      const {
        selectedChoices,
        currentQuestion,
        countDown,
        answers
      } = yield select(getMatch);
      const { openId } = yield select(getUser);
      const {
        season: { id: seasonId }
      } = yield select(getInfo);
      if (selectedChoices.sort().toString() === answers.sort().toString()) {
        yield put({ type: GAIN_SCORE, score: SCORE_GAIN_PER_QUESTION });
      }
      yield put({
        type: ADD_USER_ANSWERS,
        answers: selectedChoices.map(id => ({
          choiceId: id,
          questionId: currentQuestion.question.id,
          season: seasonId,
          timeUsage: DURATION - countDown,
          userId: openId
        }))
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}

export function* submitAnswersSaga() {
  while (yield take(SUBMIT_USER_ANSWERS_REQUESTED)) {
    try {
      yield put({ type: STOP_OPPONENT_SCORE });
      const {
        userAnswers,
        currentQuestion: { token },
        scoreGain,
        opponentScore
      } = yield select(getMatch);
      userAnswers.map((i, index) => {
        i.id = index + 1;
      });
      const isWin = scoreGain >= opponentScore ? 1 : 0;
      let rest = {
        secret: crypto.jsonEncrypt({
          answerDos: userAnswers,
          key: token,
          isWin
        })
      };
      yield put({ type: SHOW_LOADING });
      const {
        data: { data }
      } = yield call(rankApi.submitMoneyAnswers, rest);
      yield put({ type: SUBMIT_USER_ANSWERS_REQUESTED, data });
      yield put({ type: CHECK_MATCH_STATUS_REQUESTED });
    } catch (e) {
      throw new Error(e);
    }
  }
}

export function* stopExamSaga() {
  while (yield take(STOP_EXAM)) {
    try {
      yield put({ type: STOP_OPPONENT_SCORE });
      yield put({ type: STOP_COUNT_DOWN });
      yield put({ type: RESET_MATCH_STATE });
    } catch (e) {
      throw new Error(e);
    }
  }
}

export function* joinMatchSaga() {
  while (true) {
    const { password } = yield take(JOIN_MATCH_REQUESTED);
    try {
      const {
        data: { data, success, ...err }
      } = yield call(matchApi.join, password);
      if (success) {
        const { name, matchId, deadline, listInformation: information } = data;
        yield put({
          type: JOIN_MATCH_SUCCESSED,
          payload: {
            name,
            matchId,
            deadline,
            information
          }
        });
        yield put({ type: CHECK_MATCH_STATUS_REQUESTED });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({ type: JOIN_MATCH_FAILED, error: error.message });
      error.message = JSON.parse(error.message);
      if (error.message.errCode === 24) {
        Taro.showToast({
          title: error.message.errMsg,
          icon: "none",
          duration: 3000
        });
        yield put({ type: RESET_MATCH_STATE });
      }
    }
  }
}

export function* fetchMatchHistorySaga() {
  while (yield take(FETCH_MATCH_HISTORY_REQUESTED)) {
    try {
      const {
        data: { data: records, success, ...err }
      } = yield call(matchApi.history);
      if (success) {
        yield put({ type: FETCH_MATCH_HISTORY_SUCCEEDED, records });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({ type: FETCH_MATCH_HISTORY_FAILED, error: error.message });
    }
  }
}

export function* checkMatchStatusSaga() {
  try {
    const { matchId } = yield select(getMatch);
    if (!matchId) {
      return;
    }
    const {
      data: { data, success, ...err }
    } = yield call(matchApi.checkIn, matchId);
    if (success) {
      const {
        result,
        matchResultDO: {
          winnerId,
          avatarFirst,
          avatarSecond,
          first,
          second,
          firstScore,
          secondScore,
          result: matchResult,
          end
        },
        error
      } = data;
      // result === true 可以开始答题 或 可以下一轮
      if (result === true) {
        yield put({
          type: CHECK_MATCH_STATUS_SUCCEED,
          payload: {
            loading: false,
            result: true,
            first: { avatar: avatarFirst, name: first, score: firstScore },
            second: { avatar: avatarSecond, name: second, score: secondScore },
            winnerId,
            matchResult,
            end
          }
        });
      } else if (result === false) {
        // result === false, winnerId === "-1" 等待对手完成作答
        if (winnerId === "-1") {
          yield put({
            type: CHECK_MATCH_STATUS_SUCCEED,
            payload: {
              loading: true,
              result: false,
              message: "请耐心等待对手完成作答哟~"
            }
          });
          yield delay(1000);
          yield put({ type: CHECK_MATCH_STATUS_REQUESTED });
          return;
        }
        const { openId } = getUser;
        // result === false, winnerId !== openId 输了
        if (winnerId !== openId) {
          yield put({
            type: CHECK_MATCH_STATUS_SUCCEED,
            payload: {
              loading: false,
              result: false,
              first: { avatar: avatarFirst, name: first, score: firstScore },
              second: {
                avatar: avatarSecond,
                name: second,
                score: secondScore
              },
              winnerId,
              matchResult,
              end
            }
          });
          Taro.showToast({
            title: error,
            icon: "none",
            duration: 5000
          });
        }
      }
    } else {
      throw new Error(JSON.stringify(err));
    }
  } catch (error) {
    yield put({ type: CHECK_MATCH_STATUS_FAILED, error: error.message });
  }
}

export function* opponentScoreSaga() {
  while (yield take(FETCH_QUESTIONS_REQUESTED)) {
    try {
      const scoreTask = yield fork(gainOpponentScoreSaga);
      yield take(STOP_OPPONENT_SCORE);
      yield cancel(scoreTask);
    } catch (e) {
      yield put({ type: FAIL_OPPONENT_SCORE, error: e });
    }
  }
}

export function* gainOpponentScoreSaga() {
  try {
    while (true) {
      const randomTime =
        (Math.floor(Math.random() * (DURATION * TIME_RATIO)) + GUARANTEED_TIME) * 1000;
      yield delay(randomTime);
      yield put({ type: OPPONENT_GAIN_SCORE, score: SCORE_GAIN_PER_QUESTION });
    }
  } catch (e) {
    yield put({ type: FAIL_OPPONENT_SCORE, error: e });
  } finally {
    if (yield cancelled()) {
      yield call(console.log, "停止增长对手积分");
    }
  }
}

export default function* matchSaga() {
  yield takeLatest(CHECK_MATCH_STATUS_REQUESTED, checkMatchStatusSaga);
  yield all([
    countDownSaga(),
    fetchQuestionsDataSaga(),
    showQuestionSaga(),
    changeChoiceSaga(),
    confirmChoiceSaga(),
    submitAnswersSaga(),
    stopExamSaga(),
    joinMatchSaga(),
    fetchMatchHistorySaga(),
    checkMatchStatusSaga(),
    opponentScoreSaga()
  ]);
}
