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
  take
} from "redux-saga/effects";

import { crypto } from "../api";
import challengeApi from "../api/challenge";
import {
  ADD_CHALLENGE_SCORE,
  ADD_CHOICE,
  ADD_USER_ANSWERS,
  CHANGE_CHOICE,
  CONFIRM_CHOICE,
  CREATE_CHALLENGE_ROOM_FAILED,
  CREATE_CHALLENGE_ROOM_REQUESTED,
  CREATE_CHALLENGE_ROOM_SUCCESS,
  DURATION,
  FAIL_COUNT_DONW,
  FAIL_TICK,
  FETCH_CHALLENGE_INFOMATION_FAILED,
  FETCH_CHALLENGE_INFOMATION_REQUESTED,
  FETCH_CHALLENGE_INFOMATION_SUCCEEDED,
  FETCH_CHALLENGE_RECORD_FAILED,
  FETCH_CHALLENGE_RECORD_REQUESTED,
  FETCH_CHALLENGE_RECORD_SUCCEEDED,
  FETCH_QUESTIONS_FAILED,
  FETCH_QUESTIONS_REQUESTED,
  FETCH_QUESTIONS_SUCCEEDED,
  GAIN_SCORE,
  INIT_QUESTION_ITERATOR,
  NO_MORE_QUESTIONS,
  REQUEST_NEXT_QUESTION,
  RESET_CHALLENGE_ANSWER_STATE,
  RESET_COUNT_DOWN,
  SCORE_GAIN_PER_QUESTION,
  SHOW_NEXT_QUESTION,
  START_COUNT_DOWN,
  STOP_COUNT_DOWN,
  STOP_EXAM,
  SUBMIT_USER_ANSWERS_REQUESTED,
  TICK
} from "../constants/challenge";

const getChallenge = ({ challenge }) => challenge;
const getUser = ({ user }) => user;
const getInfo = ({ info }) => info;

export function* tickSaga() {
  try {
    // 一秒 tick 一下
    while (true) {
      const { countDown, currentQuestionIndex, questions } = yield select(
        getChallenge
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
      const { challengeId } = yield select(getChallenge);
      const {
        data: { data: encrypted, success, ...err }
      } = yield call(challengeApi.fetchQuestions, challengeId); // call: api 接口
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
  const questions = yield select(state => state.challenge.questions);
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
      const { questionIterator } = yield select(getChallenge);
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
      const { confirmed } = yield select(getChallenge);
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
      } = yield select(getChallenge);
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
      const {
        userAnswers,
        currentQuestion: { token },
        scoreGain,
        challengeId
      } = yield select(getChallenge);
      let data = {
        secret: crypto.jsonEncrypt({
          answerDos: userAnswers,
          key: token,
          challenge_id: challengeId
        })
      };
      yield put({ type: ADD_CHALLENGE_SCORE, score: scoreGain });
      yield call(challengeApi.submitAnswers, data);
    } catch (e) {
      throw new Error(e);
    }
  }
}

export function* stopExamSaga() {
  while (yield take(STOP_EXAM)) {
    try {
      yield put({ type: STOP_COUNT_DOWN });
      yield put({ type: RESET_CHALLENGE_ANSWER_STATE });
    } catch (e) {
      throw new Error(e);
    }
  }
}

export function* createChallengeRoomSaga() {
  while (true) {
    try {
      const { message } = yield take(CREATE_CHALLENGE_ROOM_REQUESTED);
      const {
        data: { data, success, ...err }
      } = yield call(challengeApi.createChallenge, message);
      if (success) {
        const { challengeId, deadline, remark, userName: username } = data;
        yield put({
          type: CREATE_CHALLENGE_ROOM_SUCCESS,
          challengeId,
          deadline,
          message: remark,
          username
        });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({
        type: CREATE_CHALLENGE_ROOM_FAILED,
        error: error.message
      });
    }
  }
}

export function* fetchChallengeRecordSaga() {
  while (yield take(FETCH_CHALLENGE_RECORD_REQUESTED)) {
    try {
      const {
        data: { data, success, ...err }
      } = yield call(challengeApi.fetchChallengeRecord);
      if (success) {
        const records = data.map(
          ({ challengeId, deadline, userName: username, remark }) => ({
            challengeId,
            deadline,
            username,
            remark
          })
        );
        const sortedRecords = records.sort((a, b) => b.deadline - a.deadline);
        yield put({
          type: FETCH_CHALLENGE_RECORD_SUCCEEDED,
          records: sortedRecords
        });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({
        type: FETCH_CHALLENGE_RECORD_FAILED,
        error: error.message
      });
    }
  }
}

export function* fetchChallengeInformationSaga() {
  while (yield take(FETCH_CHALLENGE_INFOMATION_REQUESTED)) {
    try {
      const { challengeId } = yield select(getChallenge);
      const {
        data: { data, success, ...err }
      } = yield call(challengeApi.fetchChallengeInformation, challengeId);
      if (success) {
        const { records, challengeInfoDO } = data;
        const {
          deadline,
          remark: message,
          userName: username
        } = challengeInfoDO;
        const ranking = records
          .map(({ userName, totalScore, avatar, openId }) => ({
            username: userName,
            score: totalScore,
            avatar,
            openId
          }))
          .sort((a, b) => b.score - a.score);
        yield put({
          type: FETCH_CHALLENGE_INFOMATION_SUCCEEDED,
          ranking,
          deadline,
          message,
          username
        });
      } else {
        throw new Error(JSON.stringify(err));
      }
    } catch (error) {
      yield put({
        type: FETCH_CHALLENGE_INFOMATION_FAILED,
        error
      });
      if (JSON.parse(error.message).errCode === 2) {
        Taro.showToast({
          title: "请先登录哟~",
          icon: "none",
          duration: 2000
        });
        setTimeout(
          Taro.navigateTo.bind(null, { url: "/pages/index/index" }),
          2000
        );
      }
    }
  }
}

export default function* challengeSaga() {
  yield all([
    createChallengeRoomSaga(),
    countDownSaga(),
    fetchQuestionsDataSaga(),
    showQuestionSaga(),
    changeChoiceSaga(),
    confirmChoiceSaga(),
    submitAnswersSaga(),
    stopExamSaga(),
    fetchChallengeRecordSaga(),
    fetchChallengeInformationSaga()
  ]);
}
