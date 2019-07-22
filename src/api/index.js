import Taro from "@tarojs/taro";
import AES from "crypto-js/aes";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import { call, delay, race } from "redux-saga/effects";
import  regeneratorRuntime from 'regenerator-runtime'

import { REQUEST_BASE_URL } from "../constants/api";

const getToken = () => Taro.getStorageSync("token");

export const request = options => {
  const res = Taro.request({
    ...options,
    header: {
      Cookie: `auth=${getToken()};`
    }
  });

  return res;
};

export class Request {
  constructor({ timeout, retryTimes }) {
    this.baseUrl = REQUEST_BASE_URL;
    this.timeout = timeout || 30000;
    this.retryTimes = retryTimes;
  }

  getToken() {
    return Taro.getStorageSync("token");
  }

  *requestIterator(config, times) {
    try {
      const { timeout, res } = yield race({
        timeout: call(delay, this.timeout),
        res: call(Taro.request, {
          ...config,
          header: {
            Cookie: `auth=${this.getToken()};`
          }
        })
      });
      if (timeout) {
        throw new Error(`Timeout of ${this.timeout}ms`);
      } else {
        return res;
      }
    } catch (e) {
      if (e === `Timeout of ${this.timeout}ms`) {
        return this.requestIterator(config, times - 1);
      }
    }
  }

  request(options) {
    this.requestIterator(options, this.retryTimes);
  }
}

/**
 * base on crypto-js
 * 后端用的是 AES/CBC/PKCS5Padding
 * key 和 iv 为 utf8 编码
 */
export default class Crypto {
  constructor(key, iv) {
    this.key = key;
    this.iv = iv;
  }

  static utf8Encode(x) {
    return Utf8.parse(x);
  }

  /**
   * 加密函数
   */
  encrypt(data) {
    return AES.encrypt(data, this.key, {
      iv: this.iv
    }).ciphertext.toString(Base64);
  }

  jsonEncrypt(data) {
    return AES.encrypt(JSON.stringify(data), this.key, {
      iv: this.iv
    }).ciphertext.toString(Base64);
  }

  /**
   * 解密函数
   */
  decrypt(data) {
    return AES.decrypt(data, this.key, { iv: this.iv }).toString(Utf8);
  }

  jsonDecrypt(data) {
    return JSON.parse(this.decrypt(data));
  }
}

const KEY = Crypto.utf8Encode("75564012e1db214d");
const IV = Crypto.utf8Encode("ee3e54c80a55628d");

export const crypto = new Crypto(KEY, IV);
