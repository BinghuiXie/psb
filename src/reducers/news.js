import { FETCH_NEWS_SUCCEED, NEXT_PAGE, NEW_INFO } from "../constants/news";

const initialNews = {
  page: 1,
  size: 15,
  news: [],
  sum: 0,
  isFirstTimeClick: false
};

export default function news(state = initialNews, action) {
  switch (action.type) {
    case FETCH_NEWS_SUCCEED:
      return {
        ...state,
        news: [...state.news, ...action.news],
        sum: action.sum
      };
    case NEXT_PAGE:
      return {
        ...state,
        page: state.page + 1
      };
    case NEW_INFO:
      return {
        ...state,
        isFirstTimeClick: true
      };
    default:
      return state;
  }
}
