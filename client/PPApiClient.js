import axios from "axios";
import { camelizeKeys, decamelizeKeys } from "humps";

export const API_HOST = "https://pp.goent26.com";

const ppClient = (endpoint, { body, method, headers, params } = {}) => {
  headers = {
    ...headers,
    "content-type": "application/json",
    accept: "application/json",
  };

  const config = {
    url: `${API_HOST}/${endpoint}`,
    headers: {
      ...headers,
    },
    method: method || "GET",
  };

  if (params) {
    config.params = decamelizeKeys(params);
  }

  if (body) {
    config.data = decamelizeKeys(body);
  }

  const onSuccess = (res) => {
    let data = res?.data || null;
    data = camelizeKeys(data);

    return {
      isSuccess: true,
      error: false,
      data,
      status: res?.status,
    };
  };

  const onError = (err) => {
    let error = err?.response?.data;
    error = camelizeKeys(error);

    return {
      isSuccess: false,
      data: err?.data,
      error,
      status: err?.response?.status,
    };
  };

  return axios(config).then(onSuccess).catch(onError);
};

export default ppClient;
