import {
  ADD_CHOICE,
  ADD_USER_ANSWERS,
  CHANGE_TYPE,
  DELETE_CHOICE,
  DOUBLE,
  DURATION,
  FETCH_EXIST_TIMES_SUCCEEDED,
  FETCH_QUESTIONS_SUCCEEDED,
  GAIN_SCORE,
  INIT_QUESTION_ITERATOR,
  OPPONENT_GAIN_SCORE,
  RESET_COUNT_DOWN,
  RESET_RANK_STATE,
  SCORE_GAIN_PER_QUESTION,
  SET_EXIST_TIMES,
  SET_MONEY,
  SHOW_NEXT_QUESTION,
  TICK
} from "../constants/rank";

const initialRank = {
  countDown: DURATION,
  questions: [],
  questionIterator: null,
  currentQuestion: { choices: [] },
  currentQuestionIndex: 0,
  answers: [],
  selectedChoices: [],
  confirmed: false,
  userAnswers: [],
  scoreGain: 0,
  opponentScore: 0,
  money: 0,
  existTimes: 0,
  type: DOUBLE
};

export default function rank(state = initialRank, action) {
  switch (action.type) {
    case TICK:
      return {
        ...state,
        countDown: Math.max(0, state.countDown - 1)
      };

    case RESET_COUNT_DOWN:
      return {
        ...state,
        countDown: action.payload
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
    case OPPONENT_GAIN_SCORE:
      return {
        ...state,
        opponentScore: Math.min(
          state.opponentScore + action.score,
          SCORE_GAIN_PER_QUESTION * state.questions.length
        )
      };
    case ADD_USER_ANSWERS:
      return {
        ...state,
        userAnswers: [...state.userAnswers, ...action.answers],
        confirmed: true
      };
    case SET_MONEY:
      return {
        ...state,
        money: action.money
      };
    case SET_EXIST_TIMES:
      return {
        ...state,
        existTimes: action.existTimes
      };
    case FETCH_EXIST_TIMES_SUCCEEDED:
      return {
        ...state,
        existTimes: action.existTimes
      };
    case CHANGE_TYPE:
      return {
        ...state,
        type: DOUBLE
      };
    case RESET_RANK_STATE:
      return initialRank;
    default:
      return state;
  }
}
