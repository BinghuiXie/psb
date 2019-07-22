import { request } from ".";
import { REQUEST_BASE_URL } from "../constants/api";

const infoApi = {
  allInformation() {
    return request({
      url: `${REQUEST_BASE_URL}information`,
      method: "GET"
    });
  },
  knowledgeInformation() {
    return request({
      url: `${REQUEST_BASE_URL}knowledge/information`,
      method: "GET"
    });
  },
  rankInformation() {
    return request({
      url: `${REQUEST_BASE_URL}rank/information`,
      method: "GET"
    });
  },
  seasonInformation() {
    return request({
      url: `${REQUEST_BASE_URL}season/information`,
      methods: "GET"
    });
  },
  totalRank(n) {
    return request({
      url: `${REQUEST_BASE_URL}score/totalRank`,
      methods: "GET",
      data: { n }
    });
  },
  schoolRank() {
    return request({
      url: `${REQUEST_BASE_URL}score/schoolRank`,
      methods: "GET"
    });
  },
  collegeRank() {
    return request({
      url: `${REQUEST_BASE_URL}score/collegeRank`,
      methods: "GET"
    });
  }
};

export default infoApi;
