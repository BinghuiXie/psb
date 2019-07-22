import {
  CHANGE_CHOICE,
  CHANGE_TYPE,
  CONFIRM_CHOICE,
  ENTER_RED_POCKET,
  EXIT_RED_POCKET,
  FETCH_EXIST_TIMES_REQUESTED,
  FETCH_QUESTIONS_REQUESTED,
  REQUEST_NEXT_QUESTION,
  START_COUNT_DOWN,
  STOP_COUNT_DOWN,
  STOP_EXAM,
  SUBMIT_USER_ANSWERS_REQUESTED,
} from "../constants/rank";

export const startCountDown = () => ({ type: START_COUNT_DOWN });
export const stopCountDown = () => ({ type: STOP_COUNT_DOWN });
export const fetchQuestions = () => ({ type: FETCH_QUESTIONS_REQUESTED });
export const showNextQuestion = () => ({ type: REQUEST_NEXT_QUESTION });
export const changeChoice = choice => ({ type: CHANGE_CHOICE, choice });
export const confirmChoice = () => ({ type: CONFIRM_CHOICE });
export const submitUserAnswers = () => ({
  type: SUBMIT_USER_ANSWERS_REQUESTED
});
export const stopExam = () => ({ type: STOP_EXAM });

export const enterRedPocket = () => ({ type: ENTER_RED_POCKET });
export const exitRedPocket = () => ({ type: EXIT_RED_POCKET });
export const getExistTimes = () => ({ type: FETCH_EXIST_TIMES_REQUESTED });
export const changeType = () => ({ type: CHANGE_TYPE });
