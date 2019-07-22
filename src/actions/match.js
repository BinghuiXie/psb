import {
  CHANGE_CHOICE,
  CONFIRM_CHOICE,
  FETCH_MATCH_HISTORY_REQUESTED,
  FETCH_QUESTIONS_REQUESTED,
  HIDE_LOADING,
  JOIN_MATCH_REQUESTED,
  REQUEST_NEXT_QUESTION,
  RESET_EXERCISE_RELATED,
  RESET_MATCH_STATE,
  SHOW_LOADING,
  SHOW_MATCH_HISTORY,
  START_COUNT_DOWN,
  STOP_COUNT_DOWN,
  STOP_EXAM,
  SUBMIT_USER_ANSWERS_REQUESTED,
  TOGGLE_MORE,
  TOGGLE_NO,
  INITIAL_ALERT_IMAGE,
  CLOSE_ALERT_IMAGE
} from "../constants/match";

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

export const showMore = () => ({ type: TOGGLE_MORE });
export const hideMore = () => ({ type: TOGGLE_NO });
export const joinMatch = password => ({ type: JOIN_MATCH_REQUESTED, password });
export const resetExercise = () => ({ type: RESET_EXERCISE_RELATED });
export const resetMatch = () => ({ type: RESET_MATCH_STATE });
export const fetchMatchHistory = () => ({
  type: FETCH_MATCH_HISTORY_REQUESTED
});
export const showMatchHistory = () => ({ type: SHOW_MATCH_HISTORY });
export const showLoading = () => ({ type: SHOW_LOADING });
export const hideLoading = () => ({ type: HIDE_LOADING });

export const initCloseStatus = () => ({type: INITIAL_ALERT_IMAGE});
export const closeModel = () => ({type: CLOSE_ALERT_IMAGE});
