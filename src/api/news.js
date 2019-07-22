import { request } from ".";
import { REQUEST_BASE_URL } from "../constants/api";

const newsApi = {
  getNews({ page, size }) {
    return request({
      url: `${REQUEST_BASE_URL}notification?page=${page}&size=${size}`,
      method: "GET"
    });
  }
};

export default newsApi;
