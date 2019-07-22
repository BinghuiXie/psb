import { FETCH_NEWS_REQUESTED, NEXT_PAGE, NEW_INFO } from "../constants/news";

export const nextPage = () => ({ type: NEXT_PAGE });
export const fetchNews = () => ({ type: FETCH_NEWS_REQUESTED });
export const judgeClickTime = () => ({type: NEW_INFO});
