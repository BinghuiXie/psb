import {
  all,
  call,
  cancel,
  cancelled,
  delay,
  fork,
  put,
  select,
  take
} from "redux-saga/effects";

import { crypto } from "../api";
import rankApi from "../api/rank";
import { ADD_RANK_SCORE } from "../constants/info";
import {
  ADD_CHOICE,
  ADD_USER_ANSWERS,
  CHANGE_CHOICE,
  CONFIRM_CHOICE,
  DURATION,
  FAIL_COUNT_DONW,
  FAIL_OPPONENT_SCORE,
  FAIL_TICK,
  FETCH_EXIST_TIMES_FAILED,
  FETCH_EXIST_TIMES_REQUESTED,
  FETCH_EXIST_TIMES_SUCCEEDED,
  FETCH_QUESTIONS_FAILED,
  FETCH_QUESTIONS_REQUESTED,
  FETCH_QUESTIONS_SUCCEEDED,
  GAIN_SCORE,
  INIT_QUESTION_ITERATOR,
  NO_MORE_QUESTIONS,
  OPPONENT_GAIN_SCORE,
  REQUEST_NEXT_QUESTION,
  RESET_COUNT_DOWN,
  RESET_RANK_STATE,
  SCORE_GAIN_PER_QUESTION,
  SHOW_NEXT_QUESTION,
  START_COUNT_DOWN,
  STOP_COUNT_DOWN,
  STOP_EXAM,
  STOP_OPPONENT_SCORE,
  SUBMIT_USER_ANSWERS_REQUESTED,
  TICK,
  GUARANTEED_TIME,
  TIME_RATIO
} from "../constants/rank";

const getRank = ({ rank }) => rank;
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

/**
 * 红包的话
 * 获取题目的 API 变，结尾提交题目的 API 也变，
 * 然后不要加 rank 的分
 */

export function* tickSaga() {
  try {
    // 一秒 tick 一下
    while (true) {
      const { countDown, currentQuestionIndex, questions } = yield select(
        getRank
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
      yield call(console.log, "倒计时停止");
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
      const duration = DURATION;
      yield put({ type: RESET_COUNT_DOWN, payload: duration }); // put: 初始化倒计时时间
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
      const { isInRedPocket } = yield select(getRank);
      const fetchQuestions = !isInRedPocket
        ? rankApi.fetchQuestions
        : rankApi.fetchMoneyQuestions;
      const {
        data: { data: encrypted, success, ...err }
      } = yield call(fetchQuestions); // call: api 接口
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
  const { questions } = yield select(getRank);
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
      const { questionIterator } = yield select(getRank);
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
      // const { selectedChoices, confirmed } = yield select(getRank);
      const { confirmed } = yield select(getRank);
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
      } = yield select(getRank);
      const { openId } = yield select(getUser);
      const {
        season: { id: seasonId }
      } = yield select(getInfo); // seasonId = state.info.season.id
      const duration = DURATION;
      if (selectedChoices.sort().toString() === answers.sort().toString()) {
        yield put({ type: GAIN_SCORE, score: SCORE_GAIN_PER_QUESTION });
      }
      yield put({
        type: ADD_USER_ANSWERS,
        answers: selectedChoices.map(id => ({
          choiceId: id,
          questionId: currentQuestion.question.id,
          season: seasonId,
          timeUsage: duration - countDown,
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
      } = yield select(getRank);
      let data = {
        secret: crypto.jsonEncrypt({
          answerDos: userAnswers,
          key: token
        })
      };
      if (scoreGain > opponentScore) {
        yield put({ type: ADD_RANK_SCORE, score: scoreGain });
        yield call(rankApi.submitAnswers, data);
      }
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
      yield put({ type: RESET_RANK_STATE });
    } catch (e) {
      throw new Error(e);
    }
  }
}

export function* getExistTimes() {
  while (yield take(FETCH_EXIST_TIMES_REQUESTED)) {
    try {
      const {
        data: { data, success, ...err }
      } = yield call(rankApi.fetchExistTimes); // call: api 接口
      if (success) {
        yield put({
          type: FETCH_EXIST_TIMES_SUCCEEDED,
          existTimes: data.times
        });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({ type: FETCH_EXIST_TIMES_FAILED, error: error.message });
    }
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

export default function* rankSaga() {
  yield all([
    countDownSaga(),
    fetchQuestionsDataSaga(),
    showQuestionSaga(),
    changeChoiceSaga(),
    confirmChoiceSaga(),
    submitAnswersSaga(),
    stopExamSaga(),
    getExistTimes(),
    opponentScoreSaga()
  ]);
}
