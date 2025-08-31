import { camelizeKeys, decamelizeKeys } from "humps";
import { Axios } from "./Axios";
import { downloadURL } from "./clientAxios";

const API_HOST = "http://localhost:8001";

const client = (
  endpoint,
  { body, method, headers, params } = {},
  customEndpoint
) => {
  const gelombangId = localStorage.getItem("selectedGelombangId") || null;

  headers = {
    ...headers,
    "content-type": "application/json",
    accept: "application/json",
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("ss-token"))}`,
    "x-gelombang-id": gelombangId,
  };

  const config = {
    url: customEndpoint ? `${endpoint}` : `${API_HOST}/${endpoint}`,
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

  return Axios(config).then(onSuccess).catch(onError);
};

export const download = (
  endpoint,
  { body, method, headers, params } = {},
  customEndpoint
) => {
  headers = {
    ...headers,
    "content-type": "application/json",
    accept: "application/json",
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("ss-token"))}`,
  };

  const config = {
    url: customEndpoint ? `${endpoint}` : `${downloadURL}/${endpoint}`,
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

  return Axios(config).then(onSuccess).catch(onError);
};

export default client;
