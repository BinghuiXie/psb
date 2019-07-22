import {
  ADD_CHOICE,
  ADD_USER_ANSWERS,
  CHECK_MATCH_STATUS_SUCCEED,
  DELETE_CHOICE,
  DURATION,
  FETCH_MATCH_HISTORY_SUCCEEDED,
  FETCH_QUESTIONS_SUCCEEDED,
  GAIN_SCORE,
  HIDE_LOADING,
  INIT_QUESTION_ITERATOR,
  JOIN_MATCH_SUCCESSED,
  RESET_COUNT_DOWN,
  RESET_EXERCISE_RELATED,
  RESET_MATCH_STATE,
  SHOW_LOADING,
  SHOW_NEXT_QUESTION,
  SUBMIT_USER_ANSWERS_REQUESTED,
  TICK,
  TOGGLE_MORE,
  TOGGLE_NO,
  OPPONENT_GAIN_SCORE,
  SCORE_GAIN_PER_QUESTION,
  CLOSE_ALERT_IMAGE,
  INITIAL_ALERT_IMAGE,
  GET_IMAGE_ID
} from "../constants/match";

const infoRelated = {
  name: "",
  matchId: null,
  deadline: 0,
  information: [],
  records: [],
  isWin: 1,
  otherUser: {},
  opponentScore: 0,
  isClose: false,
  status: {
    loading: false,
    rank: "",
    result: null,
    message: "请稍后…",
    first: {
      avatar: "",
      name: "",
      score: ""
    },
    second: {
      avatar: "",
      name: "",
      score: ""
    },
    winnerId: null,
    matchResult: null
  },
  imageID: 0
};

const exerciseRelated = {
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

const initialMatch = {
  ...infoRelated,
  ...exerciseRelated
};

export default function match(state = initialMatch, action) {
  switch (action.type) {
    case TICK:
      return {
        ...state,
        countDown: Math.max(0, state.countDown - 1)
      };

    case SUBMIT_USER_ANSWERS_REQUESTED:
      return {
        ...state,
        otherUser: action.response
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
    case RESET_MATCH_STATE:
      return initialMatch;
    case TOGGLE_MORE:
      return {
        ...state,
        show: true
      };
    case TOGGLE_NO:
      return {
        ...state,
        show: false
      };
    case JOIN_MATCH_SUCCESSED:
      return {
        ...state,
        name: action.payload.name,
        matchId: action.payload.matchId,
        deadline: action.payload.deadline,
        information: action.payload.information
      };
    case FETCH_MATCH_HISTORY_SUCCEEDED:
      return {
        ...state,
        records: action.records
      };
    case RESET_EXERCISE_RELATED:
      return {
        ...state,
        ...exerciseRelated
      };
    case CHECK_MATCH_STATUS_SUCCEED:
      return {
        ...state,
        status: {
          ...state.status,
          ...action.payload
        }
      };
    case SHOW_LOADING:
      return {
        ...state,
        status: {
          ...state.status,
          loading: true,
          message: "请稍后…"
        }
      };
    case HIDE_LOADING:
      return {
        ...state,
        status: {
          ...state.status,
          loading: false,
          message: null
        }
      };
    case OPPONENT_GAIN_SCORE:
      return {
        ...state,
        opponentScore: Math.min(
          state.opponentScore + action.score,
          SCORE_GAIN_PER_QUESTION * state.questions.length
        )
      };
    case CLOSE_ALERT_IMAGE:
      return {
        ...state,
        isClose: true
      };
    case INITIAL_ALERT_IMAGE:
      return {
        ...state,
        isClose:false
      };
    case GET_IMAGE_ID:
      return {
        ...state,
        imageID: action.id
      };
    default:
      return state;
  }
}
