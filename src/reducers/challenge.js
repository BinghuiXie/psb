import {
  ADD_CHOICE,
  ADD_USER_ANSWERS,
  CREATE_CHALLENGE_ROOM_SUCCESS,
  DELETE_CHOICE,
  DURATION,
  EXIT_CHALLENGE_ROOM,
  FETCH_CHALLENGE_INFOMATION_SUCCEEDED,
  FETCH_CHALLENGE_RECORD_SUCCEEDED,
  FETCH_QUESTIONS_SUCCEEDED,
  GAIN_SCORE,
  INIT_QUESTION_ITERATOR,
  RESET_CHALLENGE_ANSWER_STATE,
  RESET_CHALLENGE_STATE,
  RESET_COUNT_DOWN,
  SET_CHALLENGE_ID,
  SHOW_CHALLENGE_RECORD,
  SHOW_NEXT_QUESTION,
  TICK
} from "../constants/challenge";

const answerRelated = {
  countDown: 15,
  questions: [],
  questionIterator: null,
  currentQuestion: { choices: [] },
  currentQuestionIndex: 0,
  answers: [],
  selectedChoices: [],
  confirmed: false,
  userAnswers: [],
  scoreGain: 0
};

const infoRelated = {
  challengeId: null,
  deadline: 0,
  message: "",
  username: "",
  ranking: []
};

const initialChallenge = {
  records: [],
  ...answerRelated,
  ...infoRelated
};

export default function challenge(state = initialChallenge, action) {
  switch (action.type) {
    case CREATE_CHALLENGE_ROOM_SUCCESS:
      return {
        ...state,
        challengeId: action.challengeId,
        deadline: action.deadline,
        message: action.message,
        username: action.username
      };
    case FETCH_CHALLENGE_RECORD_SUCCEEDED:
      return {
        ...state,
        records: action.records
      };
    case TICK:
      return {
        ...state,
        countDown: Math.max(0, state.countDown - 1)
      };

    case RESET_COUNT_DOWN:
      return {
        ...state,
        countDown: DURATION
      };
    case FETCH_QUESTIONS_SUCCEEDED:
      return {
        ...state,
        questions: action.data
      };
    case INIT_QUESTION_ITERATOR:
      return {
        ...state,
        questionIterator: action.questionIterator
      };
    case SHOW_NEXT_QUESTION:
      return {
        ...state,
        currentQuestion: action.currentQuestion,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        answers: action.currentQuestion.answer.map(({ choiceId }) => choiceId),
        selectedChoices: [],
        confirmed: false
      };
    case ADD_CHOICE:
      return {
        ...state,
        // selectedChoices: [...state.selectedChoices, action.choice.id]
        selectedChoices: [action.choice.id]
      };
    case DELETE_CHOICE:
      return {
        ...state,
        selectedChoices: state.selectedChoices.filter(
          id => id !== action.choice.id
        )
      };
    case GAIN_SCORE:
      return {
        ...state,
        scoreGain: state.scoreGain + action.score
      };
    case ADD_USER_ANSWERS:
      return {
        ...state,
        userAnswers: [...state.userAnswers, ...action.answers],
        confirmed: true
      };
    case SHOW_CHALLENGE_RECORD:
      return {
        ...state,
        challengeId: action.challengeId,
        deadline: action.deadline,
        message: action.message,
        username: action.username
      };
    case EXIT_CHALLENGE_ROOM:
      return {
        ...state,
        ...infoRelated
      };
    case FETCH_CHALLENGE_INFOMATION_SUCCEEDED:
      return {
        ...state,
        ranking: action.ranking,
        deadline: action.deadline,
        message: action.message,
        username: action.username
      };
    case SET_CHALLENGE_ID:
      return {
        ...state,
        challengeId: action.challengeId
      };
    case RESET_CHALLENGE_ANSWER_STATE:
      return {
        ...state,
        ...answerRelated
      };
    case RESET_CHALLENGE_STATE:
      return initialChallenge;
    default:
      return state;
  }
}
