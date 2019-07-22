import { request } from ".";
import { REQUEST_BASE_URL } from "../constants/api";

const userApi = {
  login({ avatar, nickName, wxCode }) {
    console.log(avatar);
    console.log(nickName);
    console.log(wxCode);
    return request({
      url: `${REQUEST_BASE_URL}login`,
      method: "POST",
      data: {
        avatar,
        nick: nickName,
        code: wxCode
      }
    });
  },
  seasonInfomation() {
    return request({
      url: `${REQUEST_BASE_URL}season/information`,
      methods: "GET"
    });
  },
  async getAvatar() {
    return await request({
      url: `${REQUEST_BASE_URL}rank/rival`,
      method: "GET"
    });
  }
};

export default userApi;
