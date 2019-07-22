import { request } from ".";
import { REQUEST_BASE_URL } from "../constants/api";

export const bindInfo = info =>
  request({
    url: `${REQUEST_BASE_URL}updateInfo`,
    method: "PUT",
    data: info
  });

export const getSchoolList = () =>
  request({
    url: `${REQUEST_BASE_URL}admin/getAllMsg`,
    method: "GET"
  });
