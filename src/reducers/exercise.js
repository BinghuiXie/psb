import {
  ADD_CHOICE,
  ADD_USER_ANSWERS,
  DELETE_CHOICE,
  DURATION,
  FETCH_QUESTIONS_SUCCEEDED,
  GAIN_SCORE,
  INIT_QUESTION_ITERATOR,
  RESET_COUNT_DOWN,
  RESET_EXERCISE_STATE,
  SHOW_NEXT_QUESTION,
  TICK
} from "../constants/exercise";

const initialExercise = {
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

export default function exercise(state = initialExercise, action) {
  switch (action.type) {
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
    case RESET_EXERCISE_STATE:
      return initialExercise;
    default:
      return state;
  }
}
