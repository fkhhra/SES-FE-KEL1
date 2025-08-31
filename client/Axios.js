import axios from "axios";

const Axios = axios.create();

const responseHandler = (response) => {
  return response;
};

const setInterceptor = (errorHandler) => {
  Axios.interceptors.response.use(responseHandler, errorHandler);
};

export { Axios, setInterceptor };
