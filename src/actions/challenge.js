import {
  CHANGE_CHOICE,
  CONFIRM_CHOICE,
  CREATE_CHALLENGE_ROOM_REQUESTED,
  EXIT_CHALLENGE_ROOM,
  FETCH_CHALLENGE_INFOMATION_REQUESTED,
  FETCH_CHALLENGE_RECORD_REQUESTED,
  FETCH_QUESTIONS_REQUESTED,
  REQUEST_NEXT_QUESTION,
  RESET_CHALLENGE_STATE,
  SET_CHALLENGE_ID,
  SHOW_CHALLENGE_RECORD,
  START_COUNT_DOWN,
  STOP_COUNT_DOWN,
  STOP_EXAM,
  SUBMIT_USER_ANSWERS_REQUESTED
} from "../constants/challenge";

export const createRoom = message => ({
  type: CREATE_CHALLENGE_ROOM_REQUESTED,
  message
});
export const startCountDown = () => ({ type: START_COUNT_DOWN });
export const stopCountDown = () => ({ type: STOP_COUNT_DOWN });
export const fetchQuestions = () => ({ type: FETCH_QUESTIONS_REQUESTED });
export const showNextQuestion = () => ({ type: REQUEST_NEXT_QUESTION });
export const changeChoice = choice => ({ type: CHANGE_CHOICE, choice });
export const confirmChoice = () => ({ type: CONFIRM_CHOICE });
export const submitUserAnswers = () => ({
  type: SUBMIT_USER_ANSWERS_REQUESTED
});
export const fetchChallengeRecord = () => ({
  type: FETCH_CHALLENGE_RECORD_REQUESTED
});
export const resetChallengeState = () => ({ type: RESET_CHALLENGE_STATE });
export const exitChallengeRoom = () => ({ type: EXIT_CHALLENGE_ROOM });
export const showChallengeRecord = data => ({
  type: SHOW_CHALLENGE_RECORD,
  ...data
});
export const fetchChallengeInformation = () => ({
  type: FETCH_CHALLENGE_INFOMATION_REQUESTED
});
export const setChallengeID = challengeId => ({
  type: SET_CHALLENGE_ID,
  challengeId
});
export const stopExam = () => ({ type: STOP_EXAM });
