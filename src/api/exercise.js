import { request } from ".";
import { REQUEST_BASE_URL } from "../constants/api";

const api = {
  async fetchQuestions() {
    return await request({
      url: `${REQUEST_BASE_URL}knowledge/questions`,
      method: "GET"
    });
  },
  async submitAnswers(data) {
    return await request({
      url: `${REQUEST_BASE_URL}knowledge/submit`,
      method: "POST",
      data
    });
  }
};

export default api;
