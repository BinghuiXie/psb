import { request } from ".";
import { REQUEST_BASE_URL } from "../constants/api";

const matchApi = {
  async create({ name, password, deadline, information }) {
    return await request({
      url: `${REQUEST_BASE_URL}match/create`,
      method: "POST",
      data: { name, password, deadline, information }
    });
  },
  async join() {
    return await request({
      url: `${REQUEST_BASE_URL}special/questions`,
      method: "GET"
    });
  },
  async checkIn(matchId) {
    return await request({
      url: `${REQUEST_BASE_URL}match/checkIn`,
      method: "GET",
      data: { matchId }
    });
  },
  async fetchQuestions() {
    return await request({
      url: `${REQUEST_BASE_URL}special/questions`,
      method: "GET"
    });
  },
  async submitAnswers(data) {
    return await request({
      url: `${REQUEST_BASE_URL}money/submit`,
      method: "POST",
      data
    });
  },
  async getGameInfo(matchId) {
    return await request({
      url: `${REQUEST_BASE_URL}match/result`,
      method: "GET",
      data: { matchId }
    });
  },
  async history() {
    return await request({
      url: `${REQUEST_BASE_URL}money/getOwnMoney`,
      method: "GET"
    });
  }
};

export default matchApi;
