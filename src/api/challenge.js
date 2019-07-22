import { request } from ".";
import { REQUEST_BASE_URL } from "../constants/api";

const challengeApi = {
  async createChallenge(remark) {
    return await request({
      url: `${REQUEST_BASE_URL}challenge/create`,
      method: "GET",
      data: { remark }
    });
  },
  async fetchQuestions(challengeId) {
    return await request({
      url: `${REQUEST_BASE_URL}challenge/questions`,
      method: "GET",
      data: { challengeId }
    });
  },
  async submitAnswers(data) {
    return await request({
      url: `${REQUEST_BASE_URL}challenge/submit`,
      method: "POST",
      data
    });
  },
  async fetchChallengeRecord() {
    return await request({
      url: `${REQUEST_BASE_URL}challenge/history`,
      method: "GET"
    });
  },
  async fetchChallengeInformation(challengeId) {
    return await request({
      url: `${REQUEST_BASE_URL}challenge/information`,
      method: "GET",
      data: { challengeId }
    });
  }
};

export default challengeApi;
