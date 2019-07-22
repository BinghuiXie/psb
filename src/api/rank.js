import { request } from ".";
import { REQUEST_BASE_URL } from "../constants/api";

const rankApi = {
  async fetchQuestions() {
    return await request({
      url: `${REQUEST_BASE_URL}rank/questions`,
      method: "GET"
    });
  },
  async submitAnswers(data) {
    return await request({
      url: `${REQUEST_BASE_URL}rank/submit`,
      method: "POST",
      data
    });
  },
  async fetchMoneyQuestions() {
    return await request({
      url: `${REQUEST_BASE_URL}money/getQuestion`,
      method: "GET"
    });
  },
  async submitMoneyAnswers(data) {
    return await request({
      url: `${REQUEST_BASE_URL}money/submit`,
      method: "POST",
      data
    });
  },
  async fetchExistTimes() {
    return await request({
      url: `${REQUEST_BASE_URL}money/getExistTimes`,
      method: "GET"
    });
  },
  async getOwnMoney() {
    return await request({
      url: `${REQUEST_BASE_URL}money/getOwnMoney`,
      method: "GET"
    });
  },
  async getOwnMoneyLog() {
    return await request({
      url: `${REQUEST_BASE_URL}money/getOwnMoneyLog`,
      method: "GET",
      data: { page: 0, size: 99999 }
    });
  }
};

export default rankApi;
