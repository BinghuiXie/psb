import {
  FETCH_ALL_INFORMATION_REQUESTED,
  FETCH_COLLEGE_RANK_REQUETED,
  FETCH_SCHOOL_RANK_REQUETED,
  FETCH_TOTAL_RANK_REQUETED
} from "../constants/info";

export const fetchTotalRank = (n = 0) => ({
  type: FETCH_TOTAL_RANK_REQUETED,
  n
});
export const fetchSchoolRank = () => ({ type: FETCH_SCHOOL_RANK_REQUETED });
export const fetchCollegeRank = () => ({ type: FETCH_COLLEGE_RANK_REQUETED });
export const fetchAllInformation = () => ({
  type: FETCH_ALL_INFORMATION_REQUESTED
});
