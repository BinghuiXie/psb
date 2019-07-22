import { combineReducers } from "redux";

import challenge from "./challenge";
import exercise from "./exercise";
import info from "./info";
import match from "./match";
import news from "./news";
import rank from "./rank";
import user from "./user";

export default combineReducers({
  exercise,
  user,
  info,
  news,
  rank,
  challenge,
  match
});
