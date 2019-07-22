import {
  ADD_KNOWLEDGE_SCORE,
  ADD_RANK_SCORE,
  FETCH_ALL_INFORMATION_SUCCEED,
  FETCH_COLLEGE_RANK_SUCCEED,
  FETCH_SCHOOL_RANK_SUCCEED,
  FETCH_TOTAL_RANK_SUCCEED,
  KNOWLEDGE_INFORMATION_SUCCEED,
  RANK_INFORMATION_SUCCEED,
  SEASON_INFORMATION_SUCCEED
} from "../constants/info";

const initialInfo = {
  season: {
    id: "",
    start: 0,
    end: 0,
    score: 0
  },
  seasons: [],
  knowledge: {
    score: 0,
    accuracy: 0
  },
  rank: {
    score: 0,
    titles: []
  },
  rankList: {
    total: { list: [], rankNum: 0 },
    school: { list: [], rankNum: 0, my: { name: "", score: 0 } },
    college: { list: [], rankNum: 0, my: { name: "", score: 0 } }
  },
  loading: true
};

export default function info(state = initialInfo, action) {
  switch (action.type) {
    case FETCH_ALL_INFORMATION_SUCCEED:
      return {
        ...state,
        knowledge: {
          score: action.payload.knowledge.totalScore,
          accuracy: action.payload.knowledge.accuracy
        },
        rank: {
          score: action.payload.rank.userRankDO.totalScore,
          titles: action.payload.rank.rankInfoDOS
        },
        season: action.payload.season.map(i => {
          if (Date.now() > i.seasonStart && Date.now() < i.seasonEnd) {
            return i
          }
        })[0],
        seasons: action.payload.season,
        loading: false
      };

    case KNOWLEDGE_INFORMATION_SUCCEED:
      return {
        ...state,
        knowledge: {
          ...state.knowledge,
          score: action.payload.totalScore,
          accuracy: action.payload.accuracy
        }
      };
    case ADD_KNOWLEDGE_SCORE:
      return {
        ...state,
        knowledge: {
          ...state.knowledge,
          score: Math.min(300, state.knowledge.score + action.score)
        }
      };
    case ADD_RANK_SCORE:
      return {
        ...state,
        rank: {
          ...state.rank,
          score: state.rank.score + action.score
        }
      };
    case RANK_INFORMATION_SUCCEED:
      return {
        ...state,
        rank: {
          ...state.rank,
          score: action.payload.userRankDO.totalScore
        }
      };
    case SEASON_INFORMATION_SUCCEED:
      return {
        ...state,
        season: {
          ...state.season,
          id: action.season.seasonId,
          start: action.season.seasonStart,
          end: action.season.seasonEnd,
          score: action.season.seasonScore
        }
      };
    case FETCH_TOTAL_RANK_SUCCEED:
      return {
        ...state,
        rankList: {
          ...state.rankList,
          total: {
            ...state.rankList.total,
            list: action.payload.userRankDOS,
            rankNum: action.payload.rankNum,
            my: action.payload.userRankDO
          }
        }
      };
    case FETCH_SCHOOL_RANK_SUCCEED:
      return {
        ...state,
        rankList: {
          ...state.rankList,
          school: {
            ...state.rankList.school,
            list: action.payload.dos,
            rankNum: action.payload.rankNum,
            my: action.payload.user
          }
        }
      };
    case FETCH_COLLEGE_RANK_SUCCEED:
      return {
        ...state,
        rankList: {
          ...state.rankList,
          college: {
            ...state.rankList.college,
            list: action.payload.dos,
            rankNum: action.payload.rankNum,
            my: action.payload.user
          }
        }
      };
    default:
      return state;
  }
}
